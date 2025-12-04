/**
 * 自动创建数据库脚本
 * 使用方法：tsx database/create-database.ts
 */

import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
  // 连接到postgres默认数据库（不是vr_game_platform）
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || 'postgres',
    database: 'postgres', // 连接到默认数据库
  });

  try {
    console.log('\n正在连接到PostgreSQL服务器...');
    await client.connect();
    console.log('✅ 连接成功！');

    // 检查数据库是否已存在
    const checkResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'vr_game_platform'"
    );

    if (checkResult.rows.length > 0) {
      console.log('\n⚠️  数据库 vr_game_platform 已存在！');
      console.log('如需重新创建，请先在pgAdmin中删除该数据库。');
    } else {
      console.log('\n正在创建数据库 vr_game_platform...');

      // 创建数据库
      await client.query('CREATE DATABASE vr_game_platform');

      console.log('✅ 数据库创建成功！');
      console.log('\n下一步：运行 npm run db:fresh 初始化表结构和数据');
    }
  } catch (error) {
    console.error('\n❌ 创建数据库失败:');
    if (error instanceof Error) {
      console.error(error.message);

      if (error.message.includes('password authentication failed')) {
        console.error('\n💡 提示：请检查 .env 文件中的数据库密码是否正确');
      }
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

// 运行脚本
createDatabase();
