/**
 * 评论和论坛路由
 */

import express from 'express';
import * as commentController from '../controllers/comment.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// 评论相关
router.get('/games/:gameId', commentController.getGameComments);
router.post('/', authenticateToken, commentController.createComment);

// 论坛相关
router.get('/forum/sections', commentController.getForumSections);
router.get('/forum/posts', commentController.getForumPosts);
router.get('/forum/posts/:id', commentController.getPostById);
router.post('/forum/posts', authenticateToken, commentController.createPost);

export default router;
