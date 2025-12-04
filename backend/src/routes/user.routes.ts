/**
 * 用户路由
 */

import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// 需要管理员权限
router.get('/', authenticateToken, requireAdmin, userController.getUsers);
router.patch('/:id/status', authenticateToken, requireAdmin, userController.updateUserStatus);

// 需要认证
router.patch('/:id', authenticateToken, userController.updateUser);
router.get('/:id/library', authenticateToken, userController.getUserGameLibrary);
router.get('/:id/stats', authenticateToken, userController.getUserStats);

export default router;
