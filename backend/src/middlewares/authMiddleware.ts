import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../config/jwt';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

// 认证中间件
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({
        code: 401,
        message: '未授权访问，缺少令牌',
        error: 'Unauthorized'
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({
        code: 401,
        message: '无效的令牌',
        error: 'Invalid token'
      });
    }

    // 验证用户是否存在
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: payload.id },
      relations: ['role']
    });

    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户不存在',
        error: 'User not found'
      });
    }

    // 验证用户状态
    if (user.status !== 'active') {
      return res.status(403).json({
        code: 403,
        message: '用户账户已被禁用',
        error: 'Account disabled'
      });
    }

    // 将用户信息存储在请求对象中
    (req as any).user = user;
    (req as any).role = user.role;

    next();
  } catch (error) {
    console.error('认证中间件错误:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      error: 'Internal server error'
    });
  }
};

// 管理员权限中间件
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '未授权访问',
        error: 'Unauthorized'
      });
    }

    // 检查用户角色是否为管理员
    const role = (req as any).role;
    if (!role || (role.name !== 'admin' && role.name !== 'super_admin')) {
      return res.status(403).json({
        code: 403,
        message: '权限不足，需要管理员权限',
        error: 'Forbidden'
      });
    }

    next();
  } catch (error) {
    console.error('管理员权限中间件错误:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      error: 'Internal server error'
    });
  }
};