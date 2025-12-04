import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// 检测是否在 Vercel 环境
const isVercel = process.env.VERCEL === '1';

// 数据库连接池配置
export const pool = new Pool(
  isVercel
    ? {
        // Vercel Postgres 配置
        connectionString: process.env.POSTGRES_URL,
        ssl: {
          rejectUnauthorized: false,
        },
        max: 10, // Serverless 环境使用较小的连接池
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 5000,
      }
    : {
        // 本地开发配置
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'vr_game_platform',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
);

// 测试数据库连接
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

// 查询辅助函数
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}
