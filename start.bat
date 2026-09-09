@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo [Cindy] 没找到 Node.js。先安装 20 或更新版本: https://nodejs.org
  echo [Cindy] 装好后重新双击这个 start.bat。
  pause
  exit /b 1
)

if not exist "package.json" (
  echo [Cindy] 请把这个 bat 放在项目根目录再运行。
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo [Cindy] 第一次运行，正在安装依赖...
  call npm install
  if errorlevel 1 (
    echo [Cindy] npm install 失败。
    pause
    exit /b 1
  )
)

echo.
echo [Cindy] 启动后打开: http://127.0.0.1:4321
echo [Cindy] 文章:       http://127.0.0.1:4321/articles/train-test-validation
echo [Cindy] 登录:       xinyi00f@outlook.com  /  cindy
echo [Cindy] 也可以点「访客进入」。不要关这个黑窗口。
echo.

start "" cmd /c "timeout /t 6 /nobreak >nul && start http://127.0.0.1:4321/articles/train-test-validation"

call npm run dev
if errorlevel 1 (
  echo.
  echo [Cindy] 启动失败。把上面的报错留下来。
  pause
  exit /b 1
)
