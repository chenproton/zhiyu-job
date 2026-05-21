#!/bin/bash
#
# deploy.sh - Next.js Standalone 部署脚本 (v5.1 智能全自动清扫版)
#
set -euo pipefail

# ==================== 配置区 ====================
REMOTE_HOST="${REMOTE_HOST:-111.170.170.202}"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_BASE="${REMOTE_BASE:-/var/www}"

# 每个项目修改这里即可
SITE_NAME="job" 
PORT=3002

SSH_PORT="${SSH_PORT:-22}"

# ==================== 自动推导 ====================
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REMOTE_DIR="$REMOTE_BASE/$SITE_NAME"
STANDALONE_DIR="$SCRIPT_DIR/.next/standalone"
STATIC_DIR="$SCRIPT_DIR/.next/static"
PUBLIC_DIR="$SCRIPT_DIR/public"

SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=15 -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -p $SSH_PORT"

# ==================== 主入口 ====================

echo ""
echo "🚀 启动智能部署: [$SITE_NAME]"
echo ""

cd "$SCRIPT_DIR"

# ── 1. 本地构建 ──────────────────────────────────────────────────────
echo "[1/3] 本地构建中..."
rm -rf "$STANDALONE_DIR"

# 编译
pnpm install --frozen-lockfile
pnpm build

# 组装产物
rsync -a --delete --exclude='*.map' "$STATIC_DIR/" "$STANDALONE_DIR/.next/static/"
if [ -d "$PUBLIC_DIR" ]; then
  rsync -a --delete --exclude='*.map' "$PUBLIC_DIR/" "$STANDALONE_DIR/public/"
fi

echo "✅ 本地构建完成"

# ── 2. 远程智能清扫与同步 ──────────────────────────────────────────
echo ""
echo "[2/3] 远程清扫与同步..."

# 【优化点】智能识别并清理远程所有干扰目录 (dist, .next, standalone)
# 这样无论子模块叫什么名字，rsync 都不再会报 cannot delete 错误
ssh $SSH_OPTS "$REMOTE_USER@$REMOTE_HOST" \
  "mkdir -p $REMOTE_DIR && find $REMOTE_DIR -maxdepth 3 \( -name 'dist' -o -name '.next' -o -name 'standalone' \) -exec rm -rf {} + || true"

# 执行增量同步
rsync -az --delete-after \
  -e "ssh $SSH_OPTS" \
  --timeout=300 \
  --exclude='*.map' \
  --exclude='*.log' \
  --exclude='logs/' \
  "$STANDALONE_DIR/" \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"

# ── 3. 服务器进程切换 ──────────────────────────────────────────────
echo ""
echo "[3/3] 重启 PM2 服务..."

ssh $SSH_OPTS "$REMOTE_USER@$REMOTE_HOST" \
  "export SITE_NAME='$SITE_NAME'; export PORT='$PORT'; export REMOTE_DIR='$REMOTE_DIR'; bash -s" << 'REMOTE_EOF'
  set -e
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

  # 彻底删除旧进程防止残留
  pm2 delete "$SITE_NAME" &>/dev/null || true

  cd "$REMOTE_DIR"
  NODE_BIN=$(which node)
  
  # 启动新进程
  PORT="$PORT" HOSTNAME="0.0.0.0" pm2 start server.js \
    --name "$SITE_NAME" \
    --interpreter "$NODE_BIN" \
    --restart-delay 3000

  pm2 save > /dev/null
REMOTE_EOF

echo ""
echo "✨ [$SITE_NAME] 部署任务圆满完成！"
echo "   访问地址: http://$REMOTE_HOST:$PORT"
echo ""