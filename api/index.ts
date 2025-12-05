/**
 * Vercel Serverless Function 入口
 * 自包含的 API 实现
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Pool } from 'pg';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

// 数据库连接
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

// JWT 配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// 中间件
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// 认证中间件
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ code: 401, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ code: 403, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: 'VR Game Platform API',
    version: '1.0.0',
    status: 'running',
    docs: '/api/v1',
  });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'VR Game Platform API',
    version: '1.0.0'
  });
});

// ========== 认证路由 ==========

// 登录
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: 'Username and password are required'
      });
    }

    // 查询用户
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        code: 401,
        message: 'Invalid username or password'
      });
    }

    const user = result.rows[0];

    // 验证密码
    const isValidPassword = await bcryptjs.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        code: 401,
        message: 'Invalid username or password'
      });
    }

    // 生成 token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    res.json({
      code: 200,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url,
          vip_level: user.vip_level
        }
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
});

// 注册
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        code: 400,
        message: 'Username, email and password are required'
      });
    }

    // 检查用户名是否存在
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        code: 400,
        message: 'Username or email already exists'
      });
    }

    // 加密密码
    const passwordHash = await bcryptjs.hash(password, 10);

    // 创建用户
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, role, created_at',
      [username, email, passwordHash]
    );

    const user = result.rows[0];

    // 生成 token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    res.status(201).json({
      code: 201,
      message: 'Registration successful',
      data: {
        token,
        user
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
});

// 获取当前用户信息
app.get('/api/v1/auth/me', authenticateToken, async (req: any, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, role, avatar_url, bio, vip_level, vip_expire_at, points, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        code: 404,
        message: 'User not found'
      });
    }

    res.json({
      code: 200,
      message: 'Success',
      data: { user: result.rows[0] }
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
});

// ========== 游戏路由 ==========

// 获取游戏列表
app.get('/api/v1/games', async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 12,
      category,
      search,
      sortBy = 'created_at',
      order = 'desc',
      status = 'published'
    } = req.query;

    const pageNum = parseInt(page as string);
    const pageSizeNum = parseInt(pageSize as string);
    const offset = (pageNum - 1) * pageSizeNum;

    let query = `
      SELECT
        g.*,
        g.category as category_name
      FROM games g
      WHERE g.status = $1
    `;

    const queryParams: any[] = [status];
    let paramIndex = 2;

    // 分类筛选
    if (category) {
      query += ` AND g.category = $${paramIndex}`;
      queryParams.push(category);
      paramIndex++;
    }

    // 搜索
    if (search) {
      query += ` AND (g.title ILIKE $${paramIndex} OR g.description ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // 排序
    const validSortColumns = ['rating', 'download_count', 'created_at', 'view_count'];
    const sortColumn = validSortColumns.includes(sortBy as string) ? sortBy : 'created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY g.${sortColumn} ${sortOrder}`;

    // 分页
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(pageSizeNum, offset);

    const result = await pool.query(query, queryParams);

    // 获取总数
    let countQuery = 'SELECT COUNT(*) FROM games WHERE status = $1';
    const countParams: any[] = [status];
    let countIndex = 2;

    if (category) {
      countQuery += ` AND category = $${countIndex}`;
      countParams.push(category);
      countIndex++;
    }

    if (search) {
      countQuery += ` AND (title ILIKE $${countIndex} OR description ILIKE $${countIndex})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      code: 200,
      message: 'Games retrieved successfully',
      data: {
        items: result.rows,
        pagination: {
          page: pageNum,
          pageSize: pageSizeNum,
          total,
          totalPages: Math.ceil(total / pageSizeNum)
        }
      }
    });
  } catch (error: any) {
    console.error('Get games error:', error);
    res.status(500).json({
      code: 500,
      message: 'Failed to get games'
    });
  }
});

// 获取推荐游戏
app.get('/api/v1/games/recommended', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;

    const query = `
      SELECT
        g.*,
        g.category as category_name
      FROM games g
      WHERE g.status = 'published'
      ORDER BY g.rating DESC, g.download_count DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);

    res.json({
      code: 200,
      message: 'Recommended games retrieved successfully',
      data: { games: result.rows }
    });
  } catch (error: any) {
    console.error('Get recommended games error:', error);
    res.status(500).json({
      code: 500,
      message: 'Failed to get recommended games'
    });
  }
});

// 获取热门游戏
app.get('/api/v1/games/popular', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const query = `
      SELECT
        g.*,
        g.category as category_name
      FROM games g
      WHERE g.status = 'published'
      ORDER BY g.download_count DESC, g.view_count DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);

    res.json({
      code: 200,
      message: 'Popular games retrieved successfully',
      data: { games: result.rows }
    });
  } catch (error: any) {
    console.error('Get popular games error:', error);
    res.status(500).json({
      code: 500,
      message: 'Failed to get popular games'
    });
  }
});

// 根据slug获取游戏
app.get('/api/v1/games/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const query = `
      SELECT
        g.*,
        g.category as category_name
      FROM games g
      WHERE g.id = $1 AND g.status = 'published'
    `;

    const result = await pool.query(query, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        code: 404,
        message: 'Game not found'
      });
    }

    // 增加浏览量
    await pool.query('UPDATE games SET view_count = view_count + 1 WHERE id = $1', [slug]);

    res.json({
      code: 200,
      message: 'Game retrieved successfully',
      data: { game: result.rows[0] }
    });
  } catch (error: any) {
    console.error('Get game by slug error:', error);
    res.status(500).json({
      code: 500,
      message: 'Failed to get game'
    });
  }
});

// 根据ID获取游戏详情
app.get('/api/v1/games/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT
        g.*,
        g.category as category_name
      FROM games g
      WHERE g.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        code: 404,
        message: 'Game not found'
      });
    }

    // 增加浏览量
    await pool.query('UPDATE games SET view_count = view_count + 1 WHERE id = $1', [id]);

    res.json({
      code: 200,
      message: 'Game retrieved successfully',
      data: { game: result.rows[0] }
    });
  } catch (error: any) {
    console.error('Get game error:', error);
    res.status(500).json({
      code: 500,
      message: 'Failed to get game'
    });
  }
});

// 获取游戏分类
app.get('/api/v1/categories', async (req, res) => {
  try {
    const query = `
      SELECT
        category as name,
        category as slug,
        COUNT(*) as game_count
      FROM games
      WHERE status = 'published' AND category IS NOT NULL
      GROUP BY category
      ORDER BY game_count DESC
    `;

    const result = await pool.query(query);

    res.json({
      code: 200,
      message: 'Categories retrieved successfully',
      data: { categories: result.rows }
    });
  } catch (error: any) {
    console.error('Get categories error:', error);
    res.status(500).json({
      code: 500,
      message: 'Failed to get categories'
    });
  }
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: 'Route not found',
    path: req.path,
  });
});

// 错误处理中间件
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    code: 500,
    message: err.message || 'Internal server error'
  });
});

// 导出 Vercel Serverless Handler
export default app;
