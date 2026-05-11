#
# deploy.ps1 - V8.1 Windows Fix (SSH Args + Error Handling)
#
$ErrorActionPreference = 'Stop'

# 修复 UTF-8 显示乱码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# ==================== 配置区 ====================
$REMOTE_HOST = "47.251.48.187"
$REMOTE_USER = "root"
$REMOTE_BASE = "/var/www"
$SITE_NAME   = "job" 
$PORT        = "3002"
$SSH_PORT    = "22"

# ==================== 自动推导 ====================
$SCRIPT_DIR     = $PSScriptRoot
$REMOTE_DIR     = "$REMOTE_BASE/$SITE_NAME"
$STANDALONE_DIR = Join-Path $SCRIPT_DIR ".next\standalone"
$ARCHIVE_NAME   = "deploy.tar.gz"

# 确保在脚本所在目录（项目根目录）执行，避免相对路径解析错误
Set-Location $SCRIPT_DIR

# SSH 选项：数组形式，仅用于 ssh 长连接
$SSH_OPTS = @(
    "-o", "StrictHostKeyChecking=no",
    "-o", "ConnectTimeout=15",
    "-o", "ServerAliveInterval=60",
    "-o", "ServerAliveCountMax=3"
)

# 辅助函数：执行原生命令并检查退出码
function Invoke-Cmd {
    param([scriptblock]$cmd, [string]$msg)
    & $cmd
    if ($LASTEXITCODE -ne 0) { throw "$msg (exit code: $LASTEXITCODE)" }
}

Write-Host "`n>>> Deploying [$SITE_NAME]..." -ForegroundColor Cyan

try {

    # ── 1. 本地构建与资源整合 ──────────────────────────────────────
    Write-Host "[1/3] Installing & Building..." -ForegroundColor Yellow

    if (Test-Path $STANDALONE_DIR) { Remove-Item -Recurse -Force $STANDALONE_DIR }
    if (Test-Path "$SCRIPT_DIR\$ARCHIVE_NAME") { Remove-Item -Force "$SCRIPT_DIR\$ARCHIVE_NAME" }

    Invoke-Cmd { pnpm install --frozen-lockfile } "pnpm install failed"
    Invoke-Cmd { pnpm build } "pnpm build failed"

    Write-Host "--- Organizing static assets..."
    $sourceStatic = Join-Path $SCRIPT_DIR ".next\static"
    $destStatic   = Join-Path $STANDALONE_DIR ".next\static"
    $sourcePublic = Join-Path $SCRIPT_DIR "public"
    $destPublic   = Join-Path $STANDALONE_DIR "public"

    if (Test-Path $sourceStatic) {
        New-Item -ItemType Directory -Force $destStatic | Out-Null
        robocopy $sourceStatic $destStatic /E /NFL /NDL /NJH /NJS /NP
        if ($LASTEXITCODE -ge 8) { throw "robocopy failed for .next/static (exit: $LASTEXITCODE)" }
    }
    if (Test-Path $sourcePublic) {
        New-Item -ItemType Directory -Force $destPublic | Out-Null
        robocopy $sourcePublic $destPublic /E /NFL /NDL /NJH /NJS /NP
        if ($LASTEXITCODE -ge 8) { throw "robocopy failed for public (exit: $LASTEXITCODE)" }
    }

    # 验证关键静态资源是否已就位
    $cssFiles = Get-ChildItem (Join-Path $destStatic "chunks\*.css") -ErrorAction SilentlyContinue
    if (-not $cssFiles) {
        throw "No CSS files found in standalone/.next/static/chunks. Build may have failed to generate styles."
    }
    Write-Host "--- Verified $($cssFiles.Count) CSS file(s) in standalone bundle."

    Write-Host "--- Creating tarball..."
    Push-Location $STANDALONE_DIR
    try {
        tar -czf "../../$ARCHIVE_NAME" --exclude='*.map' --exclude='*.log' --exclude='logs'  .
        if ($LASTEXITCODE -ne 0) { throw "tar failed" }
    } finally {
        Pop-Location
    }

    if (!(Test-Path "$SCRIPT_DIR\$ARCHIVE_NAME")) {
        throw "Archive not found after tar"
    }

    # ── 2. 远程上传与智能清扫 ──────────────────────────────────────
    Write-Host "`n[2/3] Uploading & Remote Cleaning..." -ForegroundColor Yellow

    # scp 只用端口，不加 -o 参数（Windows OpenSSH scp 对多 -o 支持不稳定）
    Invoke-Cmd {
        scp -P $SSH_PORT "$SCRIPT_DIR\$ARCHIVE_NAME" "${REMOTE_USER}@${REMOTE_HOST}:/tmp/"
    } "scp upload failed"

    $remoteOps = "set -e; rm -rf $REMOTE_DIR; mkdir -p $REMOTE_DIR; tar -xzf /tmp/$ARCHIVE_NAME -C $REMOTE_DIR; rm -f /tmp/$ARCHIVE_NAME; chown -R root:root $REMOTE_DIR; chmod -R a+rX $REMOTE_DIR"

    # ssh 使用数组展开 @SSH_OPTS，避免字符串解析问题
    Invoke-Cmd {
        ssh -p $SSH_PORT @SSH_OPTS "${REMOTE_USER}@${REMOTE_HOST}" "bash -c '$remoteOps'"
    } "Remote cleanup failed"

    # ── 3. 进程重启 ──────────────────────────────────────────────────
    Write-Host "`n[3/3] Restarting PM2..." -ForegroundColor Yellow

    $remoteRestart = "source ~/.nvm/nvm.sh 2>/dev/null || source /etc/profile 2>/dev/null || true; pm2 delete $SITE_NAME 2>/dev/null || true; cd $REMOTE_DIR; PORT=$PORT HOSTNAME=0.0.0.0 pm2 start server.js --name $SITE_NAME --interpreter node --restart-delay 3000; pm2 save"

    Invoke-Cmd {
        ssh -p $SSH_PORT @SSH_OPTS "${REMOTE_USER}@${REMOTE_HOST}" "bash -c '$remoteRestart'"
    } "PM2 restart failed"

    Write-Host "`Deployment Successful!" -ForegroundColor Green

} catch {
    Write-Host "`n❌ Error: $_" -ForegroundColor Red
    exit 1
} finally {
    # 确保本地 tar 包不残留
    if (Test-Path "$SCRIPT_DIR\$ARCHIVE_NAME") {
        Remove-Item "$SCRIPT_DIR\$ARCHIVE_NAME" -Force -ErrorAction SilentlyContinue
    }
}
