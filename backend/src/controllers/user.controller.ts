/**
 * 用户控制器
 */

import type { Request, Response } from 'express';
import * as userService from '../services/user.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * 获取用户列表（管理员）
 */
export async function getUsers(req: Request, res: Response) {
  try {
    const { page, pageSize, role, status, search } = req.query;

    const result = await userService.getUsers({
      page: page ? parseInt(page as string) : undefined,
      pageSize: pageSize ? parseInt(pageSize as string) : undefined,
      role: role as string,
      status: status as string,
      search: search as string
    });

    return successResponse(res, result, 'Users retrieved successfully');
  } catch (error) {
    console.error('Get users error:', error);
    return errorResponse(res, 'Failed to get users', 500);
  }
}

/**
 * 更新用户信息
 */
export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // 只能更新自己的信息，除非是管理员
    if (userId !== id && req.user?.role !== 'admin') {
      return errorResponse(res, 'Permission denied', 403);
    }

    const user = await userService.updateUser(id, req.body);
    return successResponse(res, { user }, 'User updated successfully');
  } catch (error) {
    console.error('Update user error:', error);
    if (error instanceof Error) {
      return errorResponse(res, error.message, 400);
    }
    return errorResponse(res, 'Failed to update user', 500);
  }
}

/**
 * 更新用户状态
 */
export async function updateUserStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'banned', 'pending'].includes(status)) {
      return errorResponse(res, 'Invalid status', 400);
    }

    const user = await userService.updateUserStatus(id, status);
    return successResponse(res, { user }, 'User status updated successfully');
  } catch (error) {
    console.error('Update user status error:', error);
    return errorResponse(res, 'Failed to update user status', 500);
  }
}

/**
 * 获取用户游戏库
 */
export async function getUserGameLibrary(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const games = await userService.getUserGameLibrary(id);
    return successResponse(res, { games }, 'Game library retrieved successfully');
  } catch (error) {
    console.error('Get user game library error:', error);
    return errorResponse(res, 'Failed to get game library', 500);
  }
}

/**
 * 获取用户统计
 */
export async function getUserStats(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const stats = await userService.getUserStats(id);
    return successResponse(res, { stats }, 'User stats retrieved successfully');
  } catch (error) {
    console.error('Get user stats error:', error);
    return errorResponse(res, 'Failed to get user stats', 500);
  }
}
