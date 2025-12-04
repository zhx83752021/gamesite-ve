/**
 * 用户服务
 */

import { pool } from '../config/database.js';

/**
 * 获取用户列表（管理员功能）
 */
export async function getUsers(params: {
  page?: number;
  pageSize?: number;
  role?: string;
  status?: string;
  search?: string;
}) {
  const {
    page = 1,
    pageSize = 20,
    role,
    status,
    search
  } = params;

  const offset = (page - 1) * pageSize;
  let query = 'SELECT id, username, email, role, avatar, status, email_verified, games_owned, level, created_at, last_login FROM users WHERE 1=1';
  const queryParams: any[] = [];
  let paramIndex = 1;

  if (role) {
    query += ` AND role = $${paramIndex}`;
    queryParams.push(role);
    paramIndex++;
  }

  if (status) {
    query += ` AND status = $${paramIndex}`;
    queryParams.push(status);
    paramIndex++;
  }

  if (search) {
    query += ` AND (username ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
    queryParams.push(`%${search}%`);
    paramIndex++;
  }

  query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  queryParams.push(pageSize, offset);

  const result = await pool.query(query, queryParams);

  // 获取总数
  let countQuery = 'SELECT COUNT(*) FROM users WHERE 1=1';
  const countParams: any[] = [];
  let countIndex = 1;

  if (role) {
    countQuery += ` AND role = $${countIndex}`;
    countParams.push(role);
    countIndex++;
  }

  if (status) {
    countQuery += ` AND status = $${countIndex}`;
    countParams.push(status);
    countIndex++;
  }

  if (search) {
    countQuery += ` AND (username ILIKE $${countIndex} OR email ILIKE $${countIndex})`;
    countParams.push(`%${search}%`);
  }

  const countResult = await pool.query(countQuery, countParams);
  const total = parseInt(countResult.rows[0].count);

  return {
    items: result.rows,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
}

/**
 * 更新用户信息
 */
export async function updateUser(userId: string, data: {
  username?: string;
  email?: string;
  avatar?: string;
  bio?: string;
}) {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.username) {
    fields.push(`username = $${paramIndex}`);
    values.push(data.username);
    paramIndex++;
  }

  if (data.email) {
    fields.push(`email = $${paramIndex}`);
    values.push(data.email);
    paramIndex++;
  }

  if (data.avatar) {
    fields.push(`avatar = $${paramIndex}`);
    values.push(data.avatar);
    paramIndex++;
  }

  if (data.bio !== undefined) {
    fields.push(`bio = $${paramIndex}`);
    values.push(data.bio);
    paramIndex++;
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(userId);

  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, username, email, avatar, bio, role, created_at`;

  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * 更新用户状态（封禁/解封）
 */
export async function updateUserStatus(userId: string, status: string) {
  const query = 'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
  const result = await pool.query(query, [status, userId]);

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
}

/**
 * 获取用户游戏库
 */
export async function getUserGameLibrary(userId: string) {
  const query = `
    SELECT ugl.*, g.title, g.cover_image, g.developer_id
    FROM user_game_library ugl
    LEFT JOIN games g ON ugl.game_id = g.id
    WHERE ugl.user_id = $1
    ORDER BY ugl.acquired_at DESC
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
}

/**
 * 获取用户统计信息
 */
export async function getUserStats(userId: string) {
  const statsQuery = `
    SELECT
      (SELECT COUNT(*) FROM user_game_library WHERE user_id = $1) as games_owned,
      (SELECT COALESCE(SUM(play_time), 0) FROM user_game_library WHERE user_id = $1) as total_play_time,
      (SELECT COUNT(*) FROM comments WHERE user_id = $1) as comments_count,
      (SELECT COUNT(*) FROM posts WHERE user_id = $1) as posts_count,
      (SELECT COUNT(*) FROM friendships WHERE (user_id = $1 OR friend_id = $1) AND status = 'accepted') as friends_count
  `;

  const result = await pool.query(statsQuery, [userId]);
  return result.rows[0];
}
