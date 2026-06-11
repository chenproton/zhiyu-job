#!/bin/bash
#
# deploy.sh - Next.js Standalone 本地构建发布脚本
#
set -euo pipefail

# ==================== 配置区 ====================
SITE_NAME="job"
PORT=3002

# ==================== 自动推导 ====================
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STANDALONE_DIR="$SCRIPT_DIR/.next/standalone"
STATIC_DIR="$SCRIPT_DIR/.next/static"
PUBLIC_DIR="$SCRIPT_DIR/public"

# ==================== 主入口 ====================

echo ""
echo "🚀 启动本地构建发布: [$SITE_NAME]"
echo ""

cd "$SCRIPT_DIR"

# ── 1. 本地构建 ──────────────────────────────────────────────────────
echo "[1/2] 本地构建中..."
rm -rf "$STANDALONE_DIR"

# 智能依赖安装：已存在则跳过，避免每次重新比对版本
if [ ! -d "node_modules" ] || [ "${FORCE_INSTALL:-0}" = "1" ]; then
  echo "  📦 安装依赖..."
  pnpm install --prefer-offline --no-frozen-lockfile
else
  echo "  ⏩ node_modules 已存在，跳过依赖安装（设置 FORCE_INSTALL=1 可强制重新安装）"
fi

pnpm build

# 组装产物
rsync -a --delete --exclude='*.map' "$STATIC_DIR/" "$STANDALONE_DIR/.next/static/"
if [ -d "$PUBLIC_DIR" ]; then
  rsync -a --delete --exclude='*.map' "$PUBLIC_DIR/" "$STANDALONE_DIR/public/"
fi

echo "✅ 本地构建完成"

# ── 2. 本地 PM2 启动 ────────────────────────────────────────────────
echo ""
echo "[2/2] 本地 PM2 启动服务..."

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# 彻底删除旧进程防止残留
pm2 delete "$SITE_NAME" &>/dev/null || true

cd "$STANDALONE_DIR"
NODE_BIN=$(which node)

# 启动新进程
PORT="$PORT" HOSTNAME="0.0.0.0" pm2 start server.js \
  --name "$SITE_NAME" \
  --interpreter "$NODE_BIN" \
  --restart-delay 3000

pm2 save > /dev/null

echo ""
echo "✨ [$SITE_NAME] 本地发布完成！"
echo "   访问地址: http://localhost:$PORT"
echo ""
