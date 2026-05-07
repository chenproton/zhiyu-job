#!/bin/bash
#
# deploy.sh - 单项目 Next.js 部署脚本（端口直连方案）
#
# 用法:
#   ./deploy.sh              直接部署当前项目
#   REMOTE_PASS=xxx ./deploy.sh    通过环境变量传密码
#
# 前置要求:
#   1. 本地: rsync, ssh, pnpm
#   2. 服务器: node, pnpm, pm2
#   3. 阿里云控制台 → 安全组 → 入方向 → 开放对应 TCP 端口
#   4. 强烈建议配置 SSH key 免密登录
#

set -euo pipefail

# ==================== 配置区（每个项目单独修改）====================
REMOTE_HOST="${REMOTE_HOST:-47.251.48.187}"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_BASE="${REMOTE_BASE:-/var/www}"

# 站点名称 = 部署目录名 = PM2 进程名
SITE_NAME="job"

# 运行端口（直接写死）
PORT=3002

# 密码（从环境变量读取，不要在脚本里写死）
REMOTE_PASS="${REMOTE_PASS:-}"

# SSH 端口
SSH_PORT="${SSH_PORT:-22}"

# ==================== 自动推导 ====================
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REMOTE_DIR="$REMOTE_BASE/$SITE_NAME"

# 基础 SSH 命令（增加保活参数，防止长连接超时）
SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=15 -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -p $SSH_PORT"

# 构建远程 SSH 命令的辅助函数
remote_exec() {
  ssh $SSH_OPTS "$REMOTE_USER@$REMOTE_HOST" "$@"
}

# ==================== 主入口 ====================

echo ""
echo "🚀 Next.js 部署脚本"
echo "   目标服务器: $REMOTE_USER@$REMOTE_HOST"
echo "   部署站点: $SITE_NAME (端口 $PORT)"
echo ""

# 检查命令
for cmd in rsync ssh; do
  if ! command -v "$cmd" &> /dev/null; then
    echo "❌ 缺少命令: $cmd"
    exit 1
  fi
done

# 密码检查
if [ -z "$REMOTE_PASS" ]; then
  echo "💡 提示: 你没有设置 REMOTE_PASS，将尝试 SSH key 免密登录"
  echo ""
fi

# 本地确认
cd "$SCRIPT_DIR"

if [ ! -f "package.json" ]; then
  echo "❌ 当前目录不是项目根目录，找不到 package.json"
  exit 1
fi

# 1. 上传代码
echo ""
echo "[1/3] 上传代码到服务器..."
rsync -avz --delete \
  -e "ssh $SSH_OPTS" \
  --timeout=300 \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.next' \
  --exclude='*.log' \
  --exclude='.DS_Store' \
  "$SCRIPT_DIR/" \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"

# 2. 远程编译 + 启动（合并为一次 SSH 连接，减少超时概率）
echo ""
echo "[2/3] 服务器编译并启动服务..."
ssh $SSH_OPTS "$REMOTE_USER@$REMOTE_HOST" \
  "export SITE_NAME='$SITE_NAME'; export PORT='$PORT'; export REMOTE_DIR='$REMOTE_DIR'; bash -s" \
  << 'REMOTE_EOF'
  set -e
  export PATH="$HOME/.local/share/pnpm:$PATH"
  cd "$REMOTE_DIR"

  # 安装 pnpm（如果不存在）
  if ! command -v pnpm &> /dev/null; then
    echo "正在安装 pnpm..."
    npm install -g pnpm
  fi

  # 安装依赖
  echo "安装依赖..."
  pnpm install

  # 构建子项目
  if [ -d "annotation-system" ]; then
    echo "构建 annotation-system..."
    cd annotation-system && npm run build && cd ..
  fi
  if [ -d "platform-navigation-shell" ]; then
    echo "构建 platform-navigation-shell..."
    cd platform-navigation-shell && npm run build && cd ..
  fi

  # 构建 Next.js
  echo "Next.js 编译中..."
  pnpm build

  # 创建日志目录
  mkdir -p logs

  # 启动/重启服务
  if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    npm install -g pm2
  fi

  # 确保 PM2 开机自启（仅首次需要，重复执行无副作用）
  pm2 startup systemd &>/dev/null || true

  if pm2 list | grep -q "$SITE_NAME"; then
    echo "重启 $SITE_NAME ..."
    pm2 restart ecosystem.config.js
  else
    echo "首次启动 $SITE_NAME (端口 $PORT)..."
    pm2 start ecosystem.config.js
  fi

  pm2 save
  echo "PM2 进程已保存，重启后将自动恢复"
REMOTE_EOF

# 3. 状态检查
echo ""
echo "[3/3] 检查服务状态..."
sleep 2
remote_exec "pm2 show $SITE_NAME 2>/dev/null | grep -E 'name|status|memory|uptime' || echo '⚠️ 未找到进程，请检查日志'"

echo ""
echo "✅ $SITE_NAME 部署完成"
echo "   访问地址: http://$REMOTE_HOST:$PORT"
echo ""
echo "📋 常用命令:"
echo "   查看日志: ssh $REMOTE_USER@$REMOTE_HOST 'pm2 logs $SITE_NAME'"
echo "   重启服务: ssh $REMOTE_USER@$REMOTE_HOST 'pm2 restart $SITE_NAME'"
echo ""
echo "Done."
