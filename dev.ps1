# CounterApp 一键开发环境（USB 真机）
# 用法：在项目根目录执行  .\dev.ps1
# 作用：确保 adb reverse + Metro 在跑，然后让手机重新加载 JS
# 注意：只改了 App.tsx 这类 JS 代码时用这个；改了原生/依赖才需要重新编译安装

$ErrorActionPreference = 'Stop'
$ProjectDir = $PSScriptRoot
$env:Path = "D:\Node.js;D:\Android\sdk\platform-tools;" + $env:Path
$adb = 'D:\Android\sdk\platform-tools\adb.exe'
$node = 'D:\Node.js\node.exe'

# 1. 检查设备
$dev = (& $adb devices) | Select-String "device$"
if (-not $dev) {
    Write-Host "没有检测到设备。请确认：手机插好、USB 调试打开、手机上点过【允许 USB 调试】。" -ForegroundColor Red
    exit 1
}
Write-Host "设备已连接。" -ForegroundColor Green

# 2. 端口转发（手机 localhost:8081 -> 电脑 8081）
& $adb reverse tcp:8081 tcp:8081 | Out-Null

# 3. 检查 Metro 是否真的活着（不是只看端口，要看能否响应）
$up = $false
try {
    $r = Invoke-WebRequest "http://127.0.0.1:8081/status" -TimeoutSec 3 -UseBasicParsing
    $up = ($r.StatusCode -eq 200)
} catch { $up = $false }

if (-not $up) {
    Write-Host "Metro 没在运行，正在新窗口启动..." -ForegroundColor Cyan
    Start-Process -FilePath $node -ArgumentList "node_modules\react-native\cli.js", "start", "--port", "8081" -WorkingDirectory $ProjectDir
    for ($i = 0; $i -lt 60; $i++) {
        Start-Sleep -Milliseconds 500
        try {
            $r = Invoke-WebRequest "http://127.0.0.1:8081/status" -TimeoutSec 2 -UseBasicParsing
            if ($r.StatusCode -eq 200) { $up = $true; break }
        } catch { }
    }
}
if (-not $up) {
    Write-Host "Metro 启动失败，请看新弹出的 Metro 窗口里的报错。" -ForegroundColor Red
    exit 1
}
Write-Host "Metro 就绪，8081 正常响应。" -ForegroundColor Green

# 4. 让手机丢弃旧的红屏，重新拉取 bundle
& $adb shell am force-stop com.counterapp | Out-Null
& $adb shell am start -n com.counterapp/.MainActivity | Out-Null
Write-Host "已重新加载。之后改 App.tsx 保存就会自动热更新。" -ForegroundColor Green