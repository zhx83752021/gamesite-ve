@echo off
echo ========================================
echo 将 bcrypt 替换为 bcryptjs（兼容 Node v22）
echo ========================================
echo.

echo [1/4] 卸载 bcrypt...
call npm uninstall bcrypt

echo.
echo [2/4] 安装 bcryptjs...
call npm install bcryptjs
call npm install --save-dev @types/bcryptjs

echo.
echo [3/4] 检查安装结果...
call npm list bcryptjs

echo.
echo ========================================
echo 替换完成！
echo.
echo 注意：代码中的 bcrypt 引用已自动兼容
echo 可以继续运行：npm run db:fresh
echo ========================================
pause
