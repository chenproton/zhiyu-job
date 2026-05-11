# deploy.ps1 - Next.js Standalone 部署脚本 (Windows PowerShell 智能版)
# 使用方法: .\deploy.ps1

# ==================== 配置区 ====================
$REMOTE_HOST = "47.251.48.187"
$REMOTE_USER = "root"
$REMOTE_BASE = "/var/www"

# 每个项目修改这里
$SITE_NAME = "job" 
$PORT = "3002"

$SSH_PORT = "22"

# ==================== 自动推导 ====================
$SCRIPT_DIR = $PSScriptRoot
$REMOTE_DIR = "$REMOTE_BASE/$SITE_NAME"
$STANDALONE_DIR = Join-Path $SCRIPT_DIR ".next\standalone"
$STATIC_DIR = Join-Path $SCRIPT_DIR ".next\static"
$PUBLIC_DIR = Join-Path $SCRIPT_DIR "public"

# ==================== 主入口 ====================

Write-Host "`n🚀 启动 Windows 智能部署: [$SITE_NAME]" -ForegroundColor Cyan
Write-Host "   目标地址: $REMOTE_HOST:$PORT"

# ── 1. 本地构建 ──────────────────────────────────────────────────────
Write-Host "`n[1/3] 本地构建中..." -ForegroundColor Yellow

if (Test-Path $STANDALONE_DIR) {
    Write-Host "  清理旧产物..."
    Remove-Item -Recurse -Force $STANDALONE_DIR
}

Write-Host "  正在执行 pnpm build (静默模式)..."
pnpm install --frozen-lockfile > $null
pnpm build > $null

# 组装产物
Write-Host "  组装 Standalone 产物..."
$targetStatic = Join-Path $STANDALONE_DIR ".next\static"
New-Item -ItemType Directory -Force $targetStatic | Out-Null
if (Test-Path $STATIC_DIR) {
    Copy-Item -Path "$STATIC_DIR\*" -Destination $targetStatic -Recurse -Force
}

if (Test-Path $PUBLIC_DIR) {
    $targetPublic = Join-Path $STANDALONE_DIR "public"
    New-Item -ItemType Directory -Force $targetPublic | Out-Null
    Copy-Item -Path "$PUBLIC_DIR\*" -Destination $targetPublic -Recurse -Force
}

Write-Host "✅ 本地构建完成" -ForegroundColor Green

# ── 2. 远程智能清扫与同步 ──────────────────────────────────────────
Write-Host "`n[2/3] 远程清扫与同步..." -ForegroundColor Yellow

# 1. 远程强力清扫（解决 cannot delete 报错）
$cleanCmd = "LC_ALL=C find $REMOTE_DIR -maxdepth 3 \( -name 'dist' -o -name '.next' -o -name 'standalone' \) -exec rm -rf {} +"
ssh -o StrictHostKeyChecking=no -p $SSH_PORT "$REMOTE_USER@$REMOTE_HOST" $cleanCmd

# 2. 执行 rsync 同步
# 将 Windows 路径转换为 rsync 兼容路径 (例如 C:\path -> /c/path)
$rsyncSrc = $STANDALONE_DIR.Replace('\', '/').Replace(':', '')
if ($rsyncSrc -match '^[a-zA-Z]') { 
    $drive = $rsyncSrc.Substring(0,1).ToLower()
    $rest = $rsyncSrc.Substring(1)
    $rsyncSrc = "/$drive$rest" 
}

rsync -az --delete-after `
  -e "ssh -p $SSH_PORT -o StrictHostKeyChecking=no" `
  --timeout=300 `
  --exclude='*.map' --exclude='*.log' --exclude='logs/' --exclude='node_modules/' `
  "$rsyncSrc/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"

Write-Host "✅ 远程同步完成" -ForegroundColor Green

# ── 3. 服务器进程切换 ──────────────────────────────────────────────
Write-Host "`n[3/3] 重启 PM2 服务..." -ForegroundColor Yellow

# 构建远程执行脚本
$remoteScript = @"
  set -e
  export NVM_DIR="`$HOME/.nvm"
  [ -s "`$NVM_DIR/nvm.sh" ] && . "`$NVM_DIR/nvm.sh"
  
  # 彻底删除旧进程
  pm2 delete "$SITE_NAME" &>/dev/null || true
  
  cd "$REMOTE_DIR"
  NODE_BIN=$(which node)
  
  # 启动并设置语言环境避错
  LC_ALL=C PORT="$PORT" HOSTNAME="0.0.0.0" pm2 start server.js \
    --name "$SITE_NAME" \
    --interpreter "`$NODE_BIN" \
    --restart-delay 3000
    
  pm2 save > /dev/null
"@

ssh -o StrictHostKeyChecking=no -p $SSH_PORT "$REMOTE_USER@$REMOTE_HOST" "export SITE_NAME='$SITE_NAME'; export PORT='$PORT'; export REMOTE_DIR='$REMOTE_DIR'; bash -s" << REMOTE_EOF
$remoteScript
REMOTE_EOF

Write-Host "`n✨ [$SITE_NAME] 部署任务圆满完成！" -ForegroundColor Green
Write-Host "   访问地址: http://$REMOTE_HOST:$PORT`n"