# 一键在 USB 连接的安卓手机上运行 CounterApp (React Native 0.75.2)
# 用法：在 PowerShell 里执行  .\run-on-phone.ps1
$ErrorActionPreference = 'Stop'

$ProjectDir = $PSScriptRoot
$AndroidDir = Join-Path $ProjectDir 'android'
$env:Path = "D:\Node.js;D:\Android\sdk\platform-tools;" + $env:Path
$adb = 'D:\Android\sdk\platform-tools\adb.exe'

# 1. 检查设备
$devices = & $adb devices | Select-String "device$"
if (-not $devices) {
    Write-Host "没有检测到设备。请确认：手机已插好、USB 调试已打开、手机上点过【允许 USB 调试】。" -ForegroundColor Red
    exit 1
}
Write-Host "设备已连接：$($devices -join ', ')" -ForegroundColor Green

# 2. Metro 端口转发 + 服务
& $adb reverse tcp:8081 tcp:8081 | Out-Null
$metroUp = $false
try { $metroUp = (Test-NetConnection -ComputerName 127.0.0.1 -Port 8081 -InformationLevel Quiet -WarningAction SilentlyContinue) } catch { $metroUp = $false }
if (-not $metroUp) {
    Write-Host "启动 Metro（新窗口）..." -ForegroundColor Cyan
    Start-Process -FilePath "D:\Node.js\node.exe" -ArgumentList "node_modules\react-native\cli.js", "start", "--port", "8081" -WorkingDirectory $ProjectDir
    Start-Sleep -Seconds 8
}

# 3. 编译并安装 Debug 包
Write-Host "编译 Debug APK ..." -ForegroundColor Cyan
Push-Location $AndroidDir
& .\gradlew.bat app:assembleDebug --console=plain
Pop-Location

$apk = Join-Path $AndroidDir 'app\build\outputs\apk\debug\app-debug.apk'
Write-Host "安装到手机 ...（若手机弹出『正在通过USB自动安装』，请点【允许】）" -ForegroundColor Cyan
& $adb install -r $apk

# 4. 拉起 App
& $adb shell am force-stop com.counterapp
& $adb shell am start -n com.counterapp/.MainActivity
Write-Host "完成。App 已启动；改 App.tsx 后保存即可热更新。" -ForegroundColor Green
