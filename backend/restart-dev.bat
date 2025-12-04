@echo off
echo 正在终止所有 Node.js 进程...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.
echo 正在启动后端服务器...
npm run dev
