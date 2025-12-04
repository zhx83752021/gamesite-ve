/**
 * 游戏路由
 */

import express from 'express';
import * as gameController from '../controllers/game.controller.js';

const router = express.Router();

// 公开路由
router.get('/', gameController.getGames);
router.get('/recommended', gameController.getRecommendedGames);
router.get('/popular', gameController.getPopularGames);
router.get('/slug/:slug', gameController.getGameBySlug);
router.get('/:id', gameController.getGameById);

// 分类路由
router.get('/categories/list', gameController.getCategories);

export default router;
