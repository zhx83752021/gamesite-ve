/**
 * 评论和论坛服务
 */

import { pool } from '../config/database.js';

/**
 * 获取游戏评论列表
 */
export async function getGameComments(gameId: string, params: {
  page?: number;
  pageSize?: number;
  sortBy?: 'created_at' | 'helpful_count';
}) {
  const { page = 1, pageSize = 10, sortBy = 'created_at' } = params;
  const offset = (page - 1) * pageSize;

  const query = `
    SELECT c.*, u.username, u.avatar,
           (SELECT COUNT(*) FROM comment_replies WHERE comment_id = c.id) as reply_count
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.game_id = $1 AND c.status = 'published'
    ORDER BY c.${sortBy} DESC
    LIMIT $2 OFFSET $3
  `;

  const result = await pool.query(query, [gameId, pageSize, offset]);

  const countResult = await pool.query(
    'SELECT COUNT(*) FROM comments WHERE game_id = $1 AND status = \'published\'',
    [gameId]
  );

  return {
    items: result.rows,
    pagination: {
      page,
      pageSize,
      total: parseInt(countResult.rows[0].count),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / pageSize)
    }
  };
}

/**
 * 创建评论
 */
export async function createComment(data: {
  userId: string;
  gameId: string;
  rating: number;
  content: string;
  playTime?: number;
}) {
  const query = `
    INSERT INTO comments (user_id, game_id, rating, content, play_time, status)
    VALUES ($1, $2, $3, $4, $5, 'published')
    RETURNING *
  `;

  const result = await pool.query(query, [
    data.userId,
    data.gameId,
    data.rating,
    data.content,
    data.playTime || 0
  ]);

  // 更新游戏评分
  await updateGameRating(data.gameId);

  return result.rows[0];
}

/**
 * 更新游戏评分
 */
async function updateGameRating(gameId: string) {
  const query = `
    UPDATE games
    SET rating = (
      SELECT AVG(rating)::numeric(3,2)
      FROM comments
      WHERE game_id = $1 AND status = 'published'
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM comments
      WHERE game_id = $1 AND status = 'published'
    )
    WHERE id = $1
  `;

  await pool.query(query, [gameId]);
}

/**
 * 获取论坛帖子列表
 */
export async function getForumPosts(params: {
  sectionId?: string;
  page?: number;
  pageSize?: number;
}) {
  const { sectionId, page = 1, pageSize = 20 } = params;
  const offset = (page - 1) * pageSize;

  let query = `
    SELECT p.*, u.username, u.avatar, fs.name as section_name,
           (SELECT COUNT(*) FROM post_replies WHERE post_id = p.id) as reply_count
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN forum_sections fs ON p.section_id = fs.id
    WHERE p.status = 'published'
  `;

  const queryParams: any[] = [];
  let paramIndex = 1;

  if (sectionId) {
    query += ` AND p.section_id = $${paramIndex}`;
    queryParams.push(sectionId);
    paramIndex++;
  }

  query += ` ORDER BY p.is_pinned DESC, p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  queryParams.push(pageSize, offset);

  const result = await pool.query(query, queryParams);

  let countQuery = 'SELECT COUNT(*) FROM posts WHERE status = \'published\'';
  const countParams: any[] = [];

  if (sectionId) {
    countQuery += ' AND section_id = $1';
    countParams.push(sectionId);
  }

  const countResult = await pool.query(countQuery, countParams);

  return {
    items: result.rows,
    pagination: {
      page,
      pageSize,
      total: parseInt(countResult.rows[0].count),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / pageSize)
    }
  };
}

/**
 * 创建帖子
 */
export async function createPost(data: {
  userId: string;
  sectionId: string;
  title: string;
  content: string;
}) {
  const query = `
    INSERT INTO posts (user_id, section_id, title, content, status)
    VALUES ($1, $2, $3, $4, 'published')
    RETURNING *
  `;

  const result = await pool.query(query, [
    data.userId,
    data.sectionId,
    data.title,
    data.content
  ]);

  return result.rows[0];
}

/**
 * 获取帖子详情
 */
export async function getPostById(postId: string) {
  const query = `
    SELECT p.*, u.username, u.avatar, fs.name as section_name
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN forum_sections fs ON p.section_id = fs.id
    WHERE p.id = $1
  `;

  const result = await pool.query(query, [postId]);

  if (result.rows.length === 0) {
    throw new Error('Post not found');
  }

  // 增加浏览量
  await pool.query('UPDATE posts SET view_count = view_count + 1 WHERE id = $1', [postId]);

  return result.rows[0];
}

/**
 * 获取论坛板块
 */
export async function getForumSections() {
  const query = `
    SELECT fs.*,
           (SELECT COUNT(*) FROM posts WHERE section_id = fs.id AND status = 'published') as post_count
    FROM forum_sections fs
    ORDER BY fs.sort_order ASC
  `;

  const result = await pool.query(query);
  return result.rows;
}
