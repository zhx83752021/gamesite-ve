@echo off
echo =====================================
echo 重置数据库
echo =====================================
echo.

echo 正在删除并重新创建数据库...
psql -U postgres -c "DROP DATABASE IF EXISTS vr_game_platform;"
psql -U postgres -c "CREATE DATABASE vr_game_platform;"

echo.
echo 正在创建表结构...
psql -U postgres -d vr_game_platform -f database\schema.sql

echo.
echo 正在填充测试数据...
psql -U postgres -d vr_game_platform -f database\seed.sql

echo.
echo =====================================
echo 数据库重置完成！
echo =====================================
echo.
echo 测试账户信息：
echo 管理员 - 用户名: admin, 密码: admin123
echo 开发者1 - 用户名: developer1, 密码: admin123
echo.
pause
