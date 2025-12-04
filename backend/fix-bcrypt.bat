@echo off
echo 正在清理 node_modules 和缓存...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

echo.
echo 正在清理 npm 缓存...
call npm cache clean --force

echo.
echo 正在重新安装依赖（使用预编译的 bcrypt）...
call npm install --legacy-peer-deps

echo.
echo 完成！
pause
