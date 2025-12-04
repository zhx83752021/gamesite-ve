/**
 * 主路由配置
 */

import express from 'express';
import authRoutes from './auth.routes.js';
import gameRoutes from './game.routes.js';
import userRoutes from './user.routes.js';
import commentRoutes from './comment.routes.js';

const router = express.Router();

// API版本前缀
const API_VERSION = '/api/v1';

// 健康检查
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'VR Game Platform API',
    version: '1.0.0'
  });
});

// API文档
router.get(API_VERSION, (req, res) => {
  res.json({
    message: 'VR Game Platform API v1',
    endpoints: {
      auth: `${API_VERSION}/auth`,
      games: `${API_VERSION}/games`,
      users: `${API_VERSION}/users`,
      comments: `${API_VERSION}/comments`,
      forum: `${API_VERSION}/comments/forum`,
      categories: `${API_VERSION}/categories`,
    },
    documentation: 'https://github.com/your-repo/docs'
  });
});

// 认证路由
router.use(`${API_VERSION}/auth`, authRoutes);

// 游戏路由
router.use(`${API_VERSION}/games`, gameRoutes);

// 用户路由
router.use(`${API_VERSION}/users`, userRoutes);

// 评论和论坛路由
router.use(`${API_VERSION}/comments`, commentRoutes);

// 分类路由（也可以从游戏路由访问）
router.get(`${API_VERSION}/categories`, async (req, res) => {
  try {
    const { getCategories } = await import('../services/game.service.js');
    const categories = await getCategories();
    res.json({
      code: 200,
      message: 'Success',
      data: { categories },
      timestamp: Date.now()
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: 'Failed to get categories',
      timestamp: Date.now()
    });
  }
});

export default router;
