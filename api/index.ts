/**
 * Vercel Serverless Function 入口
 * 将 Express 应用适配为 Vercel Function
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from '../backend/src/middleware/error.middleware.js';
import routes from '../backend/src/routes/index.js';

// 加载环境变量
dotenv.config();

const app = express();

// 中间件
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: 'VR Game Platform API',
    version: '1.0.0',
    status: 'running',
    docs: '/api/v1',
  });
});

// 挂载所有路由
app.use(routes);

// 404处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: 'Route not found',
    path: req.path,
  });
});

// 错误处理中间件
app.use(errorHandler);

// 导出 Vercel Serverless Handler
export default app;
