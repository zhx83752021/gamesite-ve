/**
 * 数据库初始化脚本 - 用于 Vercel 首次部署
 * 访问 /init-db 来初始化数据库
 */

import { Pool } from 'pg';
import bcryptjs from 'bcryptjs';

export default async function handler(req: any, res: any) {
  // 仅允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 简单的安全验证（生产环境应使用更强的验证）
  const { secret } = req.body;
  if (secret !== process.env.INIT_DB_SECRET) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  // 创建数据库连接
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // 创建用户表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
        avatar_url TEXT,
        bio TEXT,
        vip_level INTEGER DEFAULT 0,
        vip_expire_at TIMESTAMP,
        points INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'banned', 'suspended')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 创建游戏表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS games (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) UNIQUE NOT NULL,
        description TEXT,
        category VARCHAR(50),
        tags TEXT[],
        cover_image TEXT,
        screenshots TEXT[],
        download_url TEXT,
        file_size BIGINT,
        version VARCHAR(50),
        developer VARCHAR(100),
        release_date DATE,
        rating DECIMAL(3,2) DEFAULT 0,
        download_count INTEGER DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        is_vip_only BOOLEAN DEFAULT FALSE,
        status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 创建评论表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
        parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        likes_count INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 创建论坛帖子表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS forum_posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(50),
        tags TEXT[],
        view_count INTEGER DEFAULT 0,
        reply_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        is_pinned BOOLEAN DEFAULT FALSE,
        is_locked BOOLEAN DEFAULT FALSE,
        status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'deleted')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 创建索引
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_games_category ON games(category);
      CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
      CREATE INDEX IF NOT EXISTS idx_comments_game_id ON comments(game_id);
      CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
      CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts(user_id);
      CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category);
    `);

    // 插入默认管理员账户
    const adminPassword = await bcryptjs.hash('admin123', 10);

    // 先检查管理员账户是否存在
    const adminExists = await pool.query('SELECT id FROM users WHERE username = $1', ['admin']);
    if (adminExists.rows.length === 0) {
      await pool.query(`
        INSERT INTO users (username, email, password_hash, role, bio)
        VALUES ($1, $2, $3, $4, $5);
      `, ['admin', 'admin@example.com', adminPassword, 'admin', '系统管理员']);
    }

    // 插入测试开发者账户
    const devPassword = await bcryptjs.hash('admin123', 10);
    const devExists = await pool.query('SELECT id FROM users WHERE username = $1', ['developer1']);
    if (devExists.rows.length === 0) {
      await pool.query(`
        INSERT INTO users (username, email, password_hash, role, bio)
        VALUES ($1, $2, $3, $4, $5);
      `, ['developer1', 'dev@example.com', devPassword, 'admin', '开发者账户']);
    }

    // 插入测试游戏数据
    const testGames = [
      {
        title: 'VR冒险世界',
        description: '体验前所未有的虚拟现实冒险，探索神秘的魔法世界。支持全身追踪，带来沉浸式的游戏体验。',
        category: '冒险',
        tags: ['动作', '冒险', 'VR'],
        cover_image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800',
        screenshots: ['https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=1200'],
        download_url: '/downloads/vr-adventure.zip',
        file_size: 5368709120,
        version: '1.2.0',
        developer: 'VR Studio',
        release_date: '2024-01-15',
        rating: 4.8,
        download_count: 15420,
        view_count: 38900,
        is_featured: true,
        is_vip_only: false,
        status: 'published'
      },
      {
        title: '太空探索VR',
        description: '在广袤的宇宙中驾驶飞船，探索未知星球，建立太空站。逼真的物理引擎和震撼的视觉效果。',
        category: '模拟',
        tags: ['模拟', '太空', '科幻'],
        cover_image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800',
        screenshots: ['https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200'],
        download_url: '/downloads/space-explorer.zip',
        file_size: 7340032000,
        version: '2.0.1',
        developer: 'Cosmos Games',
        release_date: '2024-02-20',
        rating: 4.9,
        download_count: 22350,
        view_count: 45670,
        is_featured: true,
        is_vip_only: false,
        status: 'published'
      },
      {
        title: 'VR射击竞技场',
        description: '激烈的多人在线射击游戏，支持最多32人同时对战。多种武器和地图可选。',
        category: '射击',
        tags: ['射击', '多人', '竞技'],
        cover_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
        screenshots: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200'],
        download_url: '/downloads/vr-shooter.zip',
        file_size: 4294967296,
        version: '1.5.2',
        developer: 'Battle VR',
        release_date: '2024-03-10',
        rating: 4.7,
        download_count: 31200,
        view_count: 62400,
        is_featured: true,
        is_vip_only: false,
        status: 'published'
      },
      {
        title: '恐怖迷宫VR',
        description: '胆小者慎入！在阴森的古堡中寻找出路，小心潜伏的怪物。最恐怖的VR体验。',
        category: '恐怖',
        tags: ['恐怖', '解谜', '冒险'],
        cover_image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800',
        screenshots: ['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200'],
        download_url: '/downloads/horror-maze.zip',
        file_size: 3221225472,
        version: '1.0.5',
        developer: 'Nightmare Studios',
        release_date: '2024-04-01',
        rating: 4.6,
        download_count: 18900,
        view_count: 41200,
        is_featured: false,
        is_vip_only: false,
        status: 'published'
      },
      {
        title: 'VR赛车极速',
        description: '真实的赛车模拟体验，支持方向盘外设。多条赛道和真实车辆授权。',
        category: '竞速',
        tags: ['竞速', '模拟', '多人'],
        cover_image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
        screenshots: ['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200'],
        download_url: '/downloads/vr-racing.zip',
        file_size: 6442450944,
        version: '3.1.0',
        developer: 'Speed Demon VR',
        release_date: '2024-05-15',
        rating: 4.8,
        download_count: 27600,
        view_count: 53800,
        is_featured: true,
        is_vip_only: false,
        status: 'published'
      },
      {
        title: 'VR音乐节奏',
        description: '跟随音乐节奏挥舞光剑，享受动感的音乐体验。支持自定义歌曲。',
        category: '音乐',
        tags: ['音乐', '节奏', '休闲'],
        cover_image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
        screenshots: ['https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200'],
        download_url: '/downloads/vr-rhythm.zip',
        file_size: 2147483648,
        version: '2.3.1',
        developer: 'Rhythm Games',
        release_date: '2024-06-01',
        rating: 4.9,
        download_count: 35400,
        view_count: 71200,
        is_featured: true,
        is_vip_only: false,
        status: 'published'
      },
      {
        title: 'VR拳击擂台',
        description: '真实的拳击运动模拟，支持全身追踪。锻炼身体的同时享受游戏乐趣。',
        category: '体育',
        tags: ['体育', '健身', '竞技'],
        cover_image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800',
        screenshots: ['https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200'],
        download_url: '/downloads/vr-boxing.zip',
        file_size: 3758096384,
        version: '1.8.0',
        developer: 'Sports VR',
        release_date: '2024-07-10',
        rating: 4.7,
        download_count: 21500,
        view_count: 48300,
        is_featured: false,
        is_vip_only: false,
        status: 'published'
      },
      {
        title: 'VR建造大师',
        description: '在虚拟世界中建造你的梦想家园。无限的创造可能，支持多人协作建造。',
        category: '创造',
        tags: ['沙盒', '建造', '创造'],
        cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        screenshots: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200'],
        download_url: '/downloads/vr-builder.zip',
        file_size: 5905580032,
        version: '2.5.0',
        developer: 'Creative VR',
        release_date: '2024-08-05',
        rating: 4.8,
        download_count: 19800,
        view_count: 42600,
        is_featured: false,
        is_vip_only: false,
        status: 'published'
      },
      {
        title: 'VIP专属：终极战场',
        description: 'VIP会员专属游戏！大规模战场模拟，支持100人同时在线对战。',
        category: '射击',
        tags: ['射击', '多人', 'VIP专属'],
        cover_image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800',
        screenshots: ['https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200'],
        download_url: '/downloads/ultimate-battlefield.zip',
        file_size: 10737418240,
        version: '1.0.0',
        developer: 'Elite VR Games',
        release_date: '2024-09-01',
        rating: 5.0,
        download_count: 8900,
        view_count: 25400,
        is_featured: true,
        is_vip_only: true,
        status: 'published'
      },
      {
        title: 'VR解谜实验室',
        description: '充满挑战的解谜游戏，需要你运用物理知识和逻辑思维来通关。',
        category: '解谜',
        tags: ['解谜', '物理', '益智'],
        cover_image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
        screenshots: ['https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200'],
        download_url: '/downloads/vr-puzzle-lab.zip',
        file_size: 2684354560,
        version: '1.3.2',
        developer: 'Puzzle Masters',
        release_date: '2024-10-15',
        rating: 4.6,
        download_count: 14200,
        view_count: 32100,
        is_featured: false,
        is_vip_only: false,
        status: 'published'
      }
    ];

    let gamesInserted = 0;
    for (const game of testGames) {
      // 先检查游戏是否存在
      const gameExists = await pool.query('SELECT id FROM games WHERE title = $1', [game.title]);
      if (gameExists.rows.length === 0) {
        await pool.query(`
          INSERT INTO games (
            title, description, category, tags, cover_image, screenshots,
            download_url, file_size, version, developer, release_date,
            rating, download_count, view_count, is_featured, is_vip_only, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);
        `, [
          game.title, game.description, game.category, game.tags, game.cover_image,
          game.screenshots, game.download_url, game.file_size, game.version,
          game.developer, game.release_date, game.rating, game.download_count,
          game.view_count, game.is_featured, game.is_vip_only, game.status
        ]);
        gamesInserted++;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Database initialized successfully with test data',
      timestamp: new Date().toISOString(),
      gamesAdded: gamesInserted,
      totalGames: testGames.length
    });
  } catch (error: any) {
    console.error('Database initialization error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
