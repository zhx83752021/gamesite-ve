import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class JWTUtil {
  private static readonly SECRET = process.env.JWT_SECRET || 'default-secret';
  private static readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
  private static readonly EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
  private static readonly REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  // 生成访问令牌
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.SECRET, {
      expiresIn: this.EXPIRES_IN,
    });
  }

  // 生成刷新令牌
  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.REFRESH_SECRET, {
      expiresIn: this.REFRESH_EXPIRES_IN,
    });
  }

  // 验证访问令牌
  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // 验证刷新令牌
  static verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.REFRESH_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }
}
