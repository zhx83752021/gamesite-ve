/**
 * 认证中间件
 */

import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service.js';
import { ResponseUtil } from '../utils/response.js';

/**
 * Token认证中间件
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return ResponseUtil.unauthorized(res, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return ResponseUtil.unauthorized(res, 'Invalid token format');
    }

    const decoded = verifyToken(token);
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    next();
  } catch (error) {
    return ResponseUtil.unauthorized(res, 'Invalid or expired token');
  }
}

/**
 * 管理员权限中间件
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return ResponseUtil.unauthorized(res);
  }

  if (req.user.role !== 'admin') {
    return ResponseUtil.forbidden(res, 'Admin permission required');
  }

  next();
}

/**
 * 开发者权限中间件
 */
export function requireDeveloper(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return ResponseUtil.unauthorized(res);
  }

  if (req.user.role !== 'developer' && req.user.role !== 'admin') {
    return ResponseUtil.forbidden(res, 'Developer permission required');
  }

  next();
}

/**
 * 版主权限中间件
 */
export function requireModerator(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return ResponseUtil.unauthorized(res);
  }

  if (!['moderator', 'admin'].includes(req.user.role)) {
    return ResponseUtil.forbidden(res, 'Moderator permission required');
  }

  next();
}

// 兼容旧名称
export const authMiddleware = authenticateToken;
export const adminMiddleware = requireAdmin;
export const developerMiddleware = requireDeveloper;
