@echo off
echo ========================================
echo 清理并重新安装（兼容 Node.js v22）
echo ========================================
echo.

echo [1/4] 删除旧的 node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo    已删除 node_modules
) else (
    echo    node_modules 不存在，跳过
)

echo.
echo [2/4] 删除 package-lock.json...
if exist package-lock.json (
    del package-lock.json
    echo    已删除 package-lock.json
) else (
    echo    package-lock.json 不存在，跳过
)

echo.
echo [3/4] 清理 npm 缓存...
call npm cache clean --force

echo.
echo [4/4] 重新安装依赖...
call npm install

echo.
echo ========================================
echo 安装完成！
echo.
echo bcryptjs 已安装（纯 JavaScript 实现，无需编译）
echo 可以运行：npm run db:fresh
echo ========================================
pause
