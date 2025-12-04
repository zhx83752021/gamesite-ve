/**
 * 评论和论坛控制器
 */

import type { Request, Response } from 'express';
import * as commentService from '../services/comment.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * 获取游戏评论
 */
export async function getGameComments(req: Request, res: Response) {
  try {
    const { gameId } = req.params;
    const { page, pageSize, sortBy } = req.query;

    const result = await commentService.getGameComments(gameId, {
      page: page ? parseInt(page as string) : undefined,
      pageSize: pageSize ? parseInt(pageSize as string) : undefined,
      sortBy: sortBy as any
    });

    return successResponse(res, result, 'Comments retrieved successfully');
  } catch (error) {
    console.error('Get comments error:', error);
    return errorResponse(res, 'Failed to get comments', 500);
  }
}

/**
 * 创建评论
 */
export async function createComment(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return errorResponse(res, 'User not authenticated', 401);
    }

    const { gameId, rating, content, playTime } = req.body;

    if (!gameId || !rating || !content) {
      return errorResponse(res, 'Game ID, rating and content are required', 400);
    }

    if (rating < 1 || rating > 5) {
      return errorResponse(res, 'Rating must be between 1 and 5', 400);
    }

    const comment = await commentService.createComment({
      userId,
      gameId,
      rating,
      content,
      playTime
    });

    return successResponse(res, { comment }, 'Comment created successfully', 201);
  } catch (error) {
    console.error('Create comment error:', error);
    return errorResponse(res, 'Failed to create comment', 500);
  }
}

/**
 * 获取论坛帖子列表
 */
export async function getForumPosts(req: Request, res: Response) {
  try {
    const { sectionId, page, pageSize } = req.query;

    const result = await commentService.getForumPosts({
      sectionId: sectionId as string,
      page: page ? parseInt(page as string) : undefined,
      pageSize: pageSize ? parseInt(pageSize as string) : undefined
    });

    return successResponse(res, result, 'Forum posts retrieved successfully');
  } catch (error) {
    console.error('Get forum posts error:', error);
    return errorResponse(res, 'Failed to get forum posts', 500);
  }
}

/**
 * 创建帖子
 */
export async function createPost(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return errorResponse(res, 'User not authenticated', 401);
    }

    const { sectionId, title, content } = req.body;

    if (!sectionId || !title || !content) {
      return errorResponse(res, 'Section ID, title and content are required', 400);
    }

    const post = await commentService.createPost({
      userId,
      sectionId,
      title,
      content
    });

    return successResponse(res, { post }, 'Post created successfully', 201);
  } catch (error) {
    console.error('Create post error:', error);
    return errorResponse(res, 'Failed to create post', 500);
  }
}

/**
 * 获取帖子详情
 */
export async function getPostById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const post = await commentService.getPostById(id);

    return successResponse(res, { post }, 'Post retrieved successfully');
  } catch (error) {
    console.error('Get post error:', error);
    if (error instanceof Error) {
      return errorResponse(res, error.message, 404);
    }
    return errorResponse(res, 'Failed to get post', 500);
  }
}

/**
 * 获取论坛板块
 */
export async function getForumSections(req: Request, res: Response) {
  try {
    const sections = await commentService.getForumSections();
    return successResponse(res, { sections }, 'Forum sections retrieved successfully');
  } catch (error) {
    console.error('Get forum sections error:', error);
    return errorResponse(res, 'Failed to get forum sections', 500);
  }
}
