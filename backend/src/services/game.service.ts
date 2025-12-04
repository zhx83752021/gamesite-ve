/**
 * 游戏服务
 */

import { pool } from '../config/database.js';
import type { Game, PaginatedResponse } from '../types/index.js';

/**
 * 获取游戏列表
 */
export async function getGames(params: {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  sortBy?: 'rating' | 'downloads' | 'price' | 'created_at';
  order?: 'asc' | 'desc';
  status?: string;
}): Promise<PaginatedResponse<any>> {
  const {
    page = 1,
    pageSize = 12,
    category,
    search,
    sortBy = 'created_at',
    order = 'desc',
    status = 'published'
  } = params;

  const offset = (page - 1) * pageSize;
  let query = `
    SELECT g.*, c.name as category_name,
           u.username as developer_name
    FROM games g
    LEFT JOIN categories c ON g.category_id = c.id
    LEFT JOIN users u ON g.developer_id = u.id
    WHERE g.status = $1
  `;

  const queryParams: any[] = [status];
  let paramIndex = 2;

  // 分类筛选
  if (category) {
    query += ` AND g.category_id = $${paramIndex}`;
    queryParams.push(category);
    paramIndex++;
  }

  // 搜索
  if (search) {
    query += ` AND (g.title ILIKE $${paramIndex} OR g.short_description ILIKE $${paramIndex})`;
    queryParams.push(`%${search}%`);
    paramIndex++;
  }

  // 排序
  const validSortColumns = ['rating', 'downloads', 'price', 'created_at'];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
  query += ` ORDER BY g.${sortColumn} ${sortOrder}`;

  // 分页
  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  queryParams.push(pageSize, offset);

  // 执行查询
  const result = await pool.query(query, queryParams);

  // 获取总数
  let countQuery = 'SELECT COUNT(*) FROM games WHERE status = $1';
  const countParams: any[] = [status];
  let countIndex = 2;

  if (category) {
    countQuery += ` AND category_id = $${countIndex}`;
    countParams.push(category);
    countIndex++;
  }

  if (search) {
    countQuery += ` AND (title ILIKE $${countIndex} OR short_description ILIKE $${countIndex})`;
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
 * 根据ID获取游戏详情
 */
export async function getGameById(id: string): Promise<any> {
  const query = `
    SELECT g.*,
           c.name as category_name,
           u.username as developer_name,
           u.avatar as developer_avatar,
           COALESCE(
             json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
             FILTER (WHERE t.id IS NOT NULL), '[]'
           ) as tags,
           COALESCE(
             json_agg(DISTINCT jsonb_build_object(
               'id', gm.id,
               'type', gm.media_type,
               'url', gm.url,
               'thumbnail', gm.thumbnail_url
             ))
             FILTER (WHERE gm.id IS NOT NULL), '[]'
           ) as media
    FROM games g
    LEFT JOIN categories c ON g.category_id = c.id
    LEFT JOIN users u ON g.developer_id = u.id
    LEFT JOIN game_tags gt ON g.id = gt.game_id
    LEFT JOIN tags t ON gt.tag_id = t.id
    LEFT JOIN game_media gm ON g.id = gm.game_id
    WHERE g.id = $1
    GROUP BY g.id, c.name, u.username, u.avatar
  `;

  const result = await pool.query(query, [id]);

  if (result.rows.length === 0) {
    throw new Error('Game not found');
  }

  // 增加浏览量
  await pool.query('UPDATE games SET views = views + 1 WHERE id = $1', [id]);

  return result.rows[0];
}

/**
 * 根据slug获取游戏
 */
export async function getGameBySlug(slug: string): Promise<any> {
  const query = `
    SELECT g.*,
           c.name as category_name,
           u.username as developer_name
    FROM games g
    LEFT JOIN categories c ON g.category_id = c.id
    LEFT JOIN users u ON g.developer_id = u.id
    WHERE g.slug = $1 AND g.status = 'published'
  `;

  const result = await pool.query(query, [slug]);

  if (result.rows.length === 0) {
    throw new Error('Game not found');
  }

  return result.rows[0];
}

/**
 * 获取推荐游戏
 */
export async function getRecommendedGames(limit = 6): Promise<any[]> {
  const query = `
    SELECT g.*, c.name as category_name
    FROM games g
    LEFT JOIN categories c ON g.category_id = c.id
    WHERE g.status = 'published'
    ORDER BY g.rating DESC, g.downloads DESC
    LIMIT $1
  `;

  const result = await pool.query(query, [limit]);
  return result.rows;
}

/**
 * 获取热门游戏
 */
export async function getPopularGames(limit = 10): Promise<any[]> {
  const query = `
    SELECT g.*, c.name as category_name
    FROM games g
    LEFT JOIN categories c ON g.category_id = c.id
    WHERE g.status = 'published'
    ORDER BY g.downloads DESC, g.views DESC
    LIMIT $1
  `;

  const result = await pool.query(query, [limit]);
  return result.rows;
}

/**
 * 获取游戏分类
 */
export async function getCategories(): Promise<any[]> {
  const query = `
    SELECT c.*, COUNT(g.id) as game_count
    FROM categories c
    LEFT JOIN games g ON c.id = g.category_id AND g.status = 'published'
    WHERE c.is_active = true
    GROUP BY c.id
    ORDER BY c.sort_order ASC, c.name ASC
  `;

  const result = await pool.query(query);
  return result.rows;
}
