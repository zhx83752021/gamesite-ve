/**
 * 认证控制器
 * 处理HTTP请求和响应
 */

import type { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * 用户注册
 * POST /api/auth/register
 */
export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    // 验证输入
    if (!username || !email || !password) {
      return errorResponse(res, 'Username, email and password are required', 400);
    }

    // 验证用户名格式
    if (username.length < 3 || username.length > 50) {
      return errorResponse(res, 'Username must be between 3 and 50 characters', 400);
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(res, 'Invalid email format', 400);
    }

    // 验证密码强度
    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters', 400);
    }

    // 注册用户
    const result = await authService.register(username, email, password);

    return successResponse(res, result, 'Registration successful', 201);
  } catch (error) {
    console.error('Register error:', error);
    if (error instanceof Error) {
      return errorResponse(res, error.message, 400);
    }
    return errorResponse(res, 'Registration failed', 500);
  }
}

/**
 * 用户登录
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    // 验证输入
    if (!username || !password) {
      return errorResponse(res, 'Username/email and password are required', 400);
    }

    // 登录
    const result = await authService.login(username, password);

    return successResponse(res, result, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      return errorResponse(res, error.message, 401);
    }
    return errorResponse(res, 'Login failed', 500);
  }
}

/**
 * 刷新token
 * POST /api/auth/refresh
 */
export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse(res, 'Refresh token is required', 400);
    }

    const result = await authService.refreshAccessToken(refreshToken);

    return successResponse(res, result, 'Token refreshed successfully');
  } catch (error) {
    console.error('Refresh token error:', error);
    if (error instanceof Error) {
      return errorResponse(res, error.message, 401);
    }
    return errorResponse(res, 'Token refresh failed', 500);
  }
}

/**
 * 获取当前用户信息
 * GET /api/auth/me
 */
export async function getCurrentUser(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return errorResponse(res, 'User not authenticated', 401);
    }

    const user = await authService.getCurrentUser(userId);

    return successResponse(res, { user }, 'User retrieved successfully');
  } catch (error) {
    console.error('Get current user error:', error);
    if (error instanceof Error) {
      return errorResponse(res, error.message, 404);
    }
    return errorResponse(res, 'Failed to get user', 500);
  }
}

/**
 * 修改密码
 * POST /api/auth/change-password
 */
export async function changePassword(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
      return errorResponse(res, 'User not authenticated', 401);
    }

    if (!oldPassword || !newPassword) {
      return errorResponse(res, 'Old password and new password are required', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 'New password must be at least 6 characters', 400);
    }

    await authService.changePassword(userId, oldPassword, newPassword);

    return successResponse(res, null, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    if (error instanceof Error) {
      return errorResponse(res, error.message, 400);
    }
    return errorResponse(res, 'Failed to change password', 500);
  }
}

/**
 * 登出
 * POST /api/auth/logout
 */
export async function logout(req: Request, res: Response) {
  try {
    // 客户端删除token即可
    // 如果需要黑名单机制，可以在这里实现
    return successResponse(res, null, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse(res, 'Logout failed', 500);
  }
}

/**
 * 检查用户名是否存在
 * GET /api/auth/check-username
 */
export async function checkUsername(req: Request, res: Response) {
  try {
    const { username } = req.query;

    if (!username || typeof username !== 'string') {
      return errorResponse(res, '用户名参数无效', 400);
    }

    const exists = await authService.checkUsernameExists(username);

    return successResponse(res, { exists }, '检查完成');
  } catch (error) {
    console.error('Check username error:', error);
    return errorResponse(res, '检查用户名失败', 500);
  }
}

/**
 * 检查邮箱是否存在
 * GET /api/auth/check-email
 */
export async function checkEmail(req: Request, res: Response) {
  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return errorResponse(res, '邮箱参数无效', 400);
    }

    const exists = await authService.checkEmailExists(email);

    return successResponse(res, { exists }, '检查完成');
  } catch (error) {
    console.error('Check email error:', error);
    return errorResponse(res, '检查邮箱失败', 500);
  }
}
