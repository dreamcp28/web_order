import jwt from 'jsonwebtoken';
import { env } from './env';

// JWT配置接口
export interface JwtPayload {
  id: number;
  phone: string;
  role_id: number;
  nickname?: string;
  avatar?: string;
}

// 生成JWT令牌
export const generateToken = (payload: JwtPayload): string => {
  const options = {
    expiresIn: env.JWT_EXPIRES_IN as string,
  };
  return jwt.sign(payload as any, env.JWT_SECRET as string, options as any);
};

// 验证JWT令牌
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};

// 从请求头中提取JWT令牌
export const extractTokenFromHeader = (header: string | undefined): string | null => {
  if (!header) return null;
  
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null;
  }
  
  return parts[1];
};