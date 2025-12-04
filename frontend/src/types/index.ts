/**
 * 通用类型定义
 */

// 游戏类型
export interface Game {
  id: number
  title: string
  description: string
  category: string
  categoryName?: string
  coverImage?: string
  coverUrl?: string
  rating: number
  price: number
  discount?: number
  finalPrice?: number
  downloads: number
  tags?: string[]
  status?: string
  releaseDate?: string
  developer?: string
  publisher?: string
  createdAt?: string
  updatedAt?: string
}

// 用户类型
export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  role?: string
  status?: string
  vipLevel?: number
  createdAt?: string
}

// 评论类型
export interface Comment {
  id: number
  userId: number
  gameId?: number
  content: string
  rating?: number
  likes: number
  createdAt: string
  updatedAt?: string
  user?: User
}

// API 响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
  timestamp?: number
}

// 分页响应类型
export interface PaginatedResponse<T = any> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 分类类型
export interface Category {
  id: number
  name: string
  slug: string
  icon?: string
  description?: string
}
