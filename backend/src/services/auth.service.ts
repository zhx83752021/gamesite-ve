/**
 * 认证服务
 * 处理用户注册、登录、token验证等业务逻辑
 */

import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { User } from '../types/index.js';

// JWT配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * 生成JWT token
 */
export function generateToken(userId: string, role: string): string {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );
}

/**
 * 生成刷新token
 */
export function generateRefreshToken(userId: string): string {
  return jwt.sign(
    { userId },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
  );
}

/**
 * 验证token
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('无效的token');
  }
}

/**
 * 验证刷新token
 */
export function verifyRefreshToken(token: string): any {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('无效的刷新token');
  }
}

/**
 * 用户注册
 */
export async function register(
  username: string,
  email: string,
  password: string
): Promise<{ user: Partial<User>; token: string; refreshToken: string }> {
  // 检查用户名是否已存在
  const existingUser = await pool.query(
    'SELECT id FROM users WHERE username = $1 OR email = $2',
    [username, email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error('用户名或邮箱已存在');
  }

  // 加密密码
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // 创建用户
  const result = await pool.query(
    `INSERT INTO users (username, email, password_hash, role, status, email_verified)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, username, email, role, avatar, created_at`,
    [username, email, passwordHash, 'user', 'active', false]
  );

  const user = result.rows[0];

  // 生成token
  const token = generateToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  return { user, token, refreshToken };
}

/**
 * 用户登录
 */
export async function login(
  usernameOrEmail: string,
  password: string
): Promise<{ user: Partial<User>; token: string; refreshToken: string }> {
  // 查询用户
  const result = await pool.query(
    `SELECT id, username, email, password_hash, role, avatar, status, email_verified
     FROM users
     WHERE username = $1 OR email = $1`,
    [usernameOrEmail]
  );

  if (result.rows.length === 0) {
    throw new Error('用户不存在');
  }

  const user = result.rows[0];

  // 检查账户状态
  if (user.status === 'banned') {
    throw new Error('账户已被封禁');
  }

  // 验证密码
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('密码错误');
  }

  // 更新最后登录时间
  await pool.query(
    'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
    [user.id]
  );

  // 生成token
  const token = generateToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  // 移除敏感信息
  delete user.password_hash;

  return { user, token, refreshToken };
}

/**
 * 刷新token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{ token: string }> {
  // 验证刷新token
  const decoded = verifyRefreshToken(refreshToken);

  // 查询用户
  const result = await pool.query(
    'SELECT id, role, status FROM users WHERE id = $1',
    [decoded.userId]
  );

  if (result.rows.length === 0) {
    throw new Error('用户不存在');
  }

  const user = result.rows[0];

  if (user.status === 'banned') {
    throw new Error('账户已被封禁');
  }

  // 生成新的access token
  const token = generateToken(user.id, user.role);

  return { token };
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(userId: string): Promise<Partial<User>> {
  const result = await pool.query(
    `SELECT id, username, email, role, avatar, bio, status, email_verified,
            total_play_time, games_owned, achievements_count, level, created_at, last_login
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error('用户不存在');
  }

  return result.rows[0];
}

/**
 * 修改密码
 */
export async function changePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> {
  // 获取当前密码
  const result = await pool.query(
    'SELECT password_hash FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error('用户不存在');
  }

  const user = result.rows[0];

  // 验证旧密码
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('原密码错误');
  }

  // 加密新密码
  const saltRounds = 10;
  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

  // 更新密码
  await pool.query(
    'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [newPasswordHash, userId]
  );
}

/**
 * 检查用户名是否存在
 */
export async function checkUsernameExists(username: string): Promise<boolean> {
  const result = await pool.query(
    'SELECT id FROM users WHERE username = $1',
    [username]
  );
  return result.rows.length > 0;
}

/**
 * 检查邮箱是否存在
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  const result = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );
  return result.rows.length > 0;
}
