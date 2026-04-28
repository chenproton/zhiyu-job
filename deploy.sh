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

# 基础 SSH 命令
SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=10 -p $SSH_PORT"

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
echo "[1/4] 上传代码到服务器..."
rsync -avz --delete \
  -e "ssh $SSH_OPTS" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.next' \
  --exclude='*.log' \
  --exclude='.DS_Store' \
  "$SCRIPT_DIR/" \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"

# 2. 远程编译
echo ""
echo "[2/4] 服务器编译..."
ssh $SSH_OPTS "$REMOTE_USER@$REMOTE_HOST" bash -s << EOF
  set -e
  export PATH="\$HOME/.local/share/pnpm:\$PATH"
  cd "$REMOTE_DIR"

  if ! command -v pnpm &> /dev/null; then
    echo "正在安装 pnpm..."
    npm install -g pnpm
  fi
  pnpm install

  if [ -d "annotation-system" ]; then
    echo "构建 annotation-system..."
    cd annotation-system && npm run build && cd ..
  fi
  if [ -d "platform-navigation-shell" ]; then
    echo "构建 platform-navigation-shell..."
    cd platform-navigation-shell && npm run build && cd ..
  fi

  echo "Next.js 编译中..."
  pnpm build
EOF

# 3. 启动/重启
echo ""
echo "[3/4] 启动服务..."
ssh $SSH_OPTS "$REMOTE_USER@$REMOTE_HOST" bash -s << EOF
  set -e
  export PATH="\$HOME/.local/share/pnpm:\$PATH"
  cd "$REMOTE_DIR"

  if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    npm install -g pm2
  fi

  if pm2 list | grep -q "$SITE_NAME"; then
    echo "重启 $SITE_NAME ..."
    pm2 restart "$SITE_NAME"
  else
    echo "首次启动 $SITE_NAME (端口 $PORT)..."
    PORT=$PORT pm2 start pnpm --name "$SITE_NAME" -- start
    pm2 save
  fi
EOF

# 4. 状态检查
echo ""
echo "[4/4] 检查服务状态..."
ssh $SSH_OPTS "$REMOTE_USER@$REMOTE_HOST" "pm2 show $SITE_NAME 2>/dev/null | grep -E 'status|memory|uptime' || echo '状态检查完成'"

echo ""
echo "✅ $SITE_NAME 部署完成"
echo "   访问地址: http://$REMOTE_HOST:$PORT"
echo ""
echo "Done."
