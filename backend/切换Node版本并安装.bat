@echo off
echo ========================================
echo 切换到 Node.js v20 并重新安装依赖
echo ========================================
echo.

echo 正在切换到 Node.js v20...
call nvm install 20
call nvm use 20

echo.
echo 当前 Node 版本：
call node --version

echo.
echo 正在清理旧文件...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

echo.
echo 正在安装依赖...
call npm install

echo.
echo ========================================
echo 安装完成！现在可以运行：npm run db:fresh
echo ========================================
pause
