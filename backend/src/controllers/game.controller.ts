/**
 * 游戏控制器
 */

import type { Request, Response } from 'express';
import * as gameService from '../services/game.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * 获取游戏列表
 * GET /api/v1/games
 */
export async function getGames(req: Request, res: Response) {
  try {
    const {
      page,
      pageSize,
      category,
      search,
      sortBy,
      order,
      status
    } = req.query;

    const result = await gameService.getGames({
      page: page ? parseInt(page as string) : undefined,
      pageSize: pageSize ? parseInt(pageSize as string) : undefined,
      category: category as string,
      search: search as string,
      sortBy: sortBy as any,
      order: order as any,
      status: status as string
    });

    return successResponse(res, result, 'Games retrieved successfully');
  } catch (error) {
    console.error('Get games error:', error);
    if (error instanceof Error) {
      return errorResponse(res, error.message, 400);
    }
    return errorResponse(res, 'Failed to get games', 500);
  }
}

/**
 * 获取游戏详情
 * GET /api/v1/games/:id
 */
export async function getGameById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const game = await gameService.getGameById(id);

    return successResponse(res, { game }, 'Game retrieved successfully');
  } catch (error) {
    console.error('Get game error:', error);
    if (error instanceof Error) {
      return errorResponse(res, error.message, 404);
    }
    return errorResponse(res, 'Failed to get game', 500);
  }
}

/**
 * 根据slug获取游戏
 * GET /api/v1/games/slug/:slug
 */
export async function getGameBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const game = await gameService.getGameBySlug(slug);

    return successResponse(res, { game }, 'Game retrieved successfully');
  } catch (error) {
    console.error('Get game by slug error:', error);
    if (error instanceof Error) {
      return errorResponse(res, error.message, 404);
    }
    return errorResponse(res, 'Failed to get game', 500);
  }
}

/**
 * 获取推荐游戏
 * GET /api/v1/games/recommended
 */
export async function getRecommendedGames(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    const games = await gameService.getRecommendedGames(limit);

    return successResponse(res, { games }, 'Recommended games retrieved successfully');
  } catch (error) {
    console.error('Get recommended games error:', error);
    return errorResponse(res, 'Failed to get recommended games', 500);
  }
}

/**
 * 获取热门游戏
 * GET /api/v1/games/popular
 */
export async function getPopularGames(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const games = await gameService.getPopularGames(limit);

    return successResponse(res, { games }, 'Popular games retrieved successfully');
  } catch (error) {
    console.error('Get popular games error:', error);
    return errorResponse(res, 'Failed to get popular games', 500);
  }
}

/**
 * 获取游戏分类
 * GET /api/v1/categories
 */
export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await gameService.getCategories();

    return successResponse(res, { categories }, 'Categories retrieved successfully');
  } catch (error) {
    console.error('Get categories error:', error);
    return errorResponse(res, 'Failed to get categories', 500);
  }
}
