import request from '@/utils/request'

export const gameApi = {
  // 获取游戏列表
  getList: (params?: {
    page?: number
    pageSize?: number
    category?: string
    search?: string
    sortBy?: string
    order?: string
  }) => request.get('/v1/games', { params }),

  // 获取游戏详情
  getById: (id: string) => request.get(`/v1/games/${id}`),

  // 获取游戏详情（别名）
  getDetail: (id: string) => request.get(`/v1/games/${id}`),

  // 根据slug获取游戏
  getBySlug: (slug: string) => request.get(`/v1/games/slug/${slug}`),

  // 获取推荐游戏
  getRecommended: (limit = 6) =>
    request.get('/v1/games/recommended', { params: { limit } }),

  // 获取热门游戏
  getPopular: (limit = 10) =>
    request.get('/v1/games/popular', { params: { limit } }),

  // 获取游戏分类
  getCategories: () => request.get('/v1/categories'),
}
