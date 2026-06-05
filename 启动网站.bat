@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo 未检测到 Node.js，请先安装 Node.js 后再双击启动。
  echo 下载地址：https://nodejs.org/
  pause
  exit /b 1
)
echo 正在启动社会实践展示与交流网站...
echo.
echo 网站地址：http://localhost:3000
echo 关闭此窗口即可停止网站服务。
echo.
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 1; Start-Process 'http://localhost:3000'"
node server.js
pause
