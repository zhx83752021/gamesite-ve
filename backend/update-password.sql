-- 更新管理员密码为 admin123
-- 使用bcrypt加密

-- 更新admin用户密码
UPDATE users
SET password_hash = crypt('admin123', gen_salt('bf'))
WHERE username = 'admin';

-- 更新developer1密码
UPDATE users
SET password_hash = crypt('admin123', gen_salt('bf'))
WHERE username = 'developer1';

-- 更新developer2密码
UPDATE users
SET password_hash = crypt('admin123', gen_salt('bf'))
WHERE username = 'developer2';

-- 更新user1密码
UPDATE users
SET password_hash = crypt('admin123', gen_salt('bf'))
WHERE username = 'user1';

-- 更新user2密码
UPDATE users
SET password_hash = crypt('admin123', gen_salt('bf'))
WHERE username = 'user2';

-- 更新user3密码
UPDATE users
SET password_hash = crypt('admin123', gen_salt('bf'))
WHERE username = 'user3';

-- 更新moderator1密码
UPDATE users
SET password_hash = crypt('admin123', gen_salt('bf'))
WHERE username = 'moderator1';

-- 验证更新
SELECT username, role, email,
       CASE WHEN password_hash IS NOT NULL THEN '密码已设置' ELSE '密码未设置' END as password_status
FROM users
WHERE username IN ('admin', 'developer1', 'developer2', 'user1', 'user2', 'user3', 'moderator1')
ORDER BY
    CASE role
        WHEN 'admin' THEN 1
        WHEN 'developer' THEN 2
        WHEN 'moderator' THEN 3
        WHEN 'user' THEN 4
        ELSE 5
    END;
