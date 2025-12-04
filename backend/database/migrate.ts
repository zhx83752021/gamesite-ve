/**
 * 数据库迁移工具
 * 用于初始化数据库和填充测试数据
 */

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES模块中获取__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量
dotenv.config();

// 数据库连接配置
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

/**
 * 智能分割SQL语句（处理函数定义中的分号）
 */
function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = '';
  let inFunction = false;

  const lines = sql.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();

    // 跳过注释和空行
    if (trimmedLine.startsWith('--') || trimmedLine.length === 0) {
      continue;
    }

    // 检测函数定义开始
    if (trimmedLine.includes('$$')) {
      inFunction = !inFunction;
    }

    current += line + '\n';

    // 如果不在函数体内且遇到分号，则分割
    if (!inFunction && trimmedLine.endsWith(';')) {
      statements.push(current.trim());
      current = '';
    }
  }

  // 添加最后一条语句
  if (current.trim().length > 0) {
    statements.push(current.trim());
  }

  return statements.filter(s => s.length > 0);
}

/**
 * 执行SQL文件
 */
async function executeSqlFile(filePath: string): Promise<void> {
  try {
    // 读取SQL文件
    const sql = fs.readFileSync(filePath, 'utf-8');

    console.log(`\n开始执行: ${path.basename(filePath)}`);
    console.log('=' .repeat(50));

    // 智能分割SQL语句
    const statements = splitSqlStatements(sql);

    console.log(`共 ${statements.length} 条SQL语句待执行...`);

    // 逐条执行SQL语句
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await pool.query(statement);
        process.stdout.write('.');
      } catch (error) {
        if (error instanceof Error && error.message.includes('already exists')) {
          process.stdout.write('.');
          continue;
        }
        console.error(`\n\n执行失败的SQL语句:\n${statement.substring(0, 200)}...\n`);
        throw error;
      }
    }

    console.log(`\n✅ ${path.basename(filePath)} 执行成功！`);
    console.log('=' .repeat(50));
  } catch (error) {
    console.error(`\n❌ 执行 ${path.basename(filePath)} 失败:`);
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
}

/**
 * 检查数据库连接
 */
async function checkConnection(): Promise<void> {
  try {
    console.log('\n检查数据库连接...');
    const result = await pool.query('SELECT current_database(), current_user, version()');
    console.log('✅ 数据库连接成功！');
    console.log(`数据库: ${result.rows[0].current_database}`);
    console.log(`用户: ${result.rows[0].current_user}`);
    console.log(`版本: ${result.rows[0].version.split(',')[0]}`);
  } catch (error) {
    console.error('❌ 数据库连接失败:');
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
}

/**
 * 初始化数据库（创建表结构）
 */
async function initSchema(): Promise<void> {
  const schemaPath = path.join(__dirname, 'schema.sql');

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema文件不存在: ${schemaPath}`);
  }

  await executeSqlFile(schemaPath);
}

/**
 * 填充测试数据
 */
async function seedData(): Promise<void> {
  const seedPath = path.join(__dirname, 'seed.sql');

  if (!fs.existsSync(seedPath)) {
    throw new Error(`Seed文件不存在: ${seedPath}`);
  }

  await executeSqlFile(seedPath);
}

/**
 * 重置数据库（危险操作！）
 */
async function resetDatabase(): Promise<void> {
  console.log('\n⚠️  警告：即将删除所有数据表！');
  console.log('此操作不可逆，请确认你知道自己在做什么。');

  // 获取所有表名
  const result = await pool.query(`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
  `);

  if (result.rows.length === 0) {
    console.log('数据库中没有表，跳过删除操作。');
    return;
  }

  console.log(`\n将删除 ${result.rows.length} 个表...`);

  // 删除所有表
  for (const row of result.rows) {
    await pool.query(`DROP TABLE IF EXISTS ${row.tablename} CASCADE`);
    console.log(`✅ 删除表: ${row.tablename}`);
  }

  console.log('\n所有表已删除。');
}

/**
 * 主函数
 */
async function main() {
  const command = process.argv[2];

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   VR 游戏平台 - 数据库迁移工具        ║');
  console.log('╚════════════════════════════════════════╝');

  try {
    // 检查环境变量
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL 环境变量未设置！请检查 .env 文件。');
    }

    // 检查数据库连接
    await checkConnection();

    switch (command) {
      case 'init':
        console.log('\n📦 开始初始化数据库结构...');
        await initSchema();
        console.log('\n🎉 数据库初始化完成！');
        break;

      case 'seed':
        console.log('\n🌱 开始填充测试数据...');
        await seedData();
        console.log('\n🎉 测试数据填充完成！');
        break;

      case 'reset':
        console.log('\n🔄 开始重置数据库...');
        await resetDatabase();
        console.log('\n✅ 数据库重置完成！');
        break;

      case 'fresh':
        console.log('\n🔄 开始全新安装（重置 + 初始化 + 填充数据）...');
        await resetDatabase();
        await initSchema();
        await seedData();
        console.log('\n🎉 全新安装完成！');
        break;

      default:
        console.log('\n使用方法:');
        console.log('  npm run db:init   - 初始化数据库结构（创建表）');
        console.log('  npm run db:seed   - 填充测试数据');
        console.log('  npm run db:reset  - 重置数据库（删除所有表）');
        console.log('  npm run db:fresh  - 全新安装（重置+初始化+填充）');
        console.log('\n示例:');
        console.log('  npm run db:init');
        console.log('  npm run db:seed');
        break;
    }
  } catch (error) {
    console.error('\n❌ 操作失败:');
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  } finally {
    // 关闭数据库连接
    await pool.end();
    console.log('\n数据库连接已关闭。');
  }
}

// 运行主函数
main();
