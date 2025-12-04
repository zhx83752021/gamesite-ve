import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Redis客户端配置
export const redis = new Redis({
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

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

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
