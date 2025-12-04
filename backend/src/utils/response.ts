import { Response } from 'express';
import { ApiResponse } from '../types/index.js';

export class ResponseUtil {
  // 成功响应
  static success<T>(res: Response, data?: T, message = 'Success', code = 200): Response {
    const response: ApiResponse<T> = {
      code,
      message,
      data,
      timestamp: Date.now(),
    };
    return res.status(code).json(response);
  }

  // 错误响应
  static error(res: Response, message: string, code = 500, error?: string): Response {
    const response: ApiResponse = {
      code,
      message,
      error,
      timestamp: Date.now(),
    };
    return res.status(code).json(response);
  }

  // 创建成功响应
  static created<T>(res: Response, data: T, message = 'Created successfully'): Response {
    return this.success(res, data, message, 201);
  }

  // 未授权响应
  static unauthorized(res: Response, message = 'Unauthorized'): Response {
    return this.error(res, message, 401);
  }

  // 禁止访问响应
  static forbidden(res: Response, message = 'Forbidden'): Response {
    return this.error(res, message, 403);
  }

  // 未找到响应
  static notFound(res: Response, message = 'Resource not found'): Response {
    return this.error(res, message, 404);
  }

  // 参数错误响应
  static badRequest(res: Response, message = 'Bad request', error?: string): Response {
    return this.error(res, message, 400, error);
  }
}

// 便捷导出函数
export const successResponse = <T>(res: Response, data?: T, message = 'Success', code = 200) =>
  ResponseUtil.success(res, data, message, code);

export const errorResponse = (res: Response, message: string, code = 500, error?: string) =>
  ResponseUtil.error(res, message, code, error);
