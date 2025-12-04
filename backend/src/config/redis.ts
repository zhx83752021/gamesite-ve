import Redis from 'ioredis';
import { Redis as UpstashRedis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();

// 检测是否在 Vercel 环境
const isVercel = process.env.VERCEL === '1';

// Redis 客户端配置
let redis: any;

if (isVercel && process.env.UPSTASH_REDIS_REST_URL) {
  // Vercel 环境使用 Upstash Redis
  redis = new UpstashRedis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  console.log('✅ Using Upstash Redis for Vercel');
} else {
  // 本地环境使用 ioredis
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redis.on('error', (err: Error) => {
    console.error('❌ Redis error:', err);
  });
}

export { redis };

// 缓存键命名规范
export const CacheKeys = {
  // 游戏相关
  gameDetail: (id: string) => `game:${id}`,
  gameList: (page: number, filters: string) => `games:${page}:${filters}`,
  hotGames: () => 'games:hot',

  // 用户相关
  userProfile: (id: string) => `user:${id}`,
  userGames: (id: string) => `user:${id}:games`,

  // 统计数据
  dailyStats: (date: string) => `stats:daily:${date}`,
  onlineUsers: () => 'users:online',
};

// 缓存过期时间（秒）
export const CacheTTL = {
  gameDetail: 3600,      // 1小时
  gameList: 600,         // 10分钟
  hotGames: 300,         // 5分钟
  userProfile: 1800,     // 30分钟
  dailyStats: 86400,     // 24小时
};
