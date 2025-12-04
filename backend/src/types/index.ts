import { Request } from 'express';

// 扩展Express Request类型
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'developer' | 'admin' | 'moderator';
  status: 'active' | 'banned' | 'pending';
  emailVerified: boolean;
  totalPlayTime: number;
  gamesOwned: number;
  achievementsCount: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

// 游戏类型
export interface Game {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  developerId: string;
  publisher?: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  trailerVideo?: string;
  categoryId: string;
  price: number;
  pricingType: 'free' | 'paid' | 'subscription';
  discountPrice?: number;
  discountEndDate?: Date;
  rating: number;
  ratingCount: number;
  downloads: number;
  views: number;
  status: 'draft' | 'review' | 'published' | 'archived';
  ageRating?: string;
  supportedPlatforms: string[];
  supportedLanguages: string[];
  features?: string[];
  systemRequirements: {
    minimum: SystemRequirements;
    recommended: SystemRequirements;
  };
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface SystemRequirements {
  cpu: string;
  memory: string;
  graphics: string;
  storage: string;
}

// 评论类型
export interface Comment {
  id: string;
  userId: string;
  gameId: string;
  rating: number;
  content: string;
  images?: string[];
  playTime?: number;
  helpfulCount: number;
  isVerifiedPurchase: boolean;
  status: 'pending' | 'published' | 'hidden';
  createdAt: Date;
  updatedAt: Date;
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  error?: string;
  timestamp: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 全局类型扩展
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}
