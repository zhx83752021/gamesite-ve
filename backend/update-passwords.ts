/**
 * 更新测试账户密码为 admin123
 * 使用方法: npx tsx update-passwords.ts
 */

import { pool } from './src/config/database.js';
import bcrypt from 'bcrypt';

async function updatePasswords() {
  console.log('========================================');
  console.log('开始更新测试账户密码...');
  console.log('========================================\n');

  const testUsers = [
    { username: 'admin', role: 'admin' },
    { username: 'developer1', role: 'developer' },
    { username: 'developer2', role: 'developer' },
    { username: 'user1', role: 'user' },
    { username: 'user2', role: 'user' },
    { username: 'user3', role: 'user' },
    { username: 'moderator1', role: 'moderator' }
  ];

  const password = 'admin123';
  const saltRounds = 10;

  try {
    // 生成密码哈希
    console.log(`正在生成密码哈希 (密码: ${password})...`);
    const passwordHash = await bcrypt.hash(password, saltRounds);
    console.log('密码哈希生成成功\n');

    // 更新每个用户的密码
    for (const user of testUsers) {
      try {
        const result = await pool.query(
          'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE username = $2 RETURNING id, username, role',
          [passwordHash, user.username]
        );

        if (result.rowCount && result.rowCount > 0) {
          console.log(`✅ ${user.username} (${user.role}) - 密码更新成功`);
        } else {
          console.log(`⚠️  ${user.username} - 用户不存在，跳过`);
        }
      } catch (error) {
        console.error(`❌ ${user.username} - 更新失败:`, error);
      }
    }

    console.log('\n========================================');
    console.log('密码更新完成！');
    console.log('========================================');
    console.log('\n所有测试账户密码已更新为: admin123\n');
    console.log('测试账户列表：');
    console.log('- admin / admin123 (管理员)');
    console.log('- developer1 / admin123 (开发者)');
    console.log('- user1 / admin123 (普通用户)');
    console.log('\n现在可以使用这些账户登录了！\n');

  } catch (error) {
    console.error('密码更新过程中出错:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// 执行更新
updatePasswords();
