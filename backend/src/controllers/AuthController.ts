import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

// 认证控制器类
export class AuthController {
  private authService = new AuthService();

  // 用户注册
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { phone, email, password, nickname, username } = req.body;

      // 验证请求参数
      if (!password) {
        res.status(400).json({
          code: 400,
          message: '请求参数错误',
          error: 'Password is required'
        });
        return;
      }

      let phoneNumber = phone;
      let emailAddress = email;

      // 如果提供邮箱但没有手机号，生成一个临时手机号（实际应用中应该要求提供手机号）
      if (email && !phone) {
        // 检查邮箱是否已注册
        const { AppDataSource } = await import('../config/database');
        const userRepository = AppDataSource.getRepository((await import('../models/User')).User);
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
          res.status(400).json({
            code: 400,
            message: '邮箱已注册',
            error: 'Email already registered'
          });
          return;
        }
        // 为邮箱用户生成一个虚拟手机号（实际应用中应该要求提供真实手机号）
        phoneNumber = `1${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`;
        emailAddress = email;
      } else if (phone) {
        // 验证手机号格式
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
          res.status(400).json({
            code: 400,
            message: '手机号格式错误',
            error: 'Invalid phone number format'
          });
          return;
        }
        phoneNumber = phone;
      } else {
        res.status(400).json({
          code: 400,
          message: '请求参数错误',
          error: 'Phone or email is required'
        });
        return;
      }

      // 验证密码强度
      if (password.length < 6) {
        res.status(400).json({
          code: 400,
          message: '密码长度不能少于6位',
          error: 'Password must be at least 6 characters long'
        });
        return;
      }

      // 调用注册服务
      const user = await this.authService.register(phoneNumber, password, nickname || username || email?.split('@')[0]);
      
      // 如果提供了邮箱，更新用户邮箱
      if (emailAddress) {
        const { AppDataSource } = await import('../config/database');
        const userRepository = AppDataSource.getRepository((await import('../models/User')).User);
        user.email = emailAddress;
        await userRepository.save(user);
      }

      // 生成JWT令牌
      const { token } = await this.authService.login(phone, password);

      // 返回用户信息和令牌
      res.status(200).json({
        code: 200,
        message: '注册成功',
        data: {
          id: user.id,
          phone: user.phone,
          nickname: user.nickname,
          avatar: user.avatar,
          email: user.email,
          role_id: user.role_id,
          status: user.status,
          token
        }
      });
    } catch (error) {
      console.error('注册控制器错误:', error);
      const errorMessage = error instanceof Error ? error.message : '注册失败';
      res.status(400).json({
        code: 400,
        message: errorMessage,
        error: errorMessage
      });
    }
  }

  // 用户登录
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { phone, email, password } = req.body;

      // 验证请求参数
      if (!password) {
        res.status(400).json({
          code: 400,
          message: '请求参数错误',
          error: 'Password is required'
        });
        return;
      }

      // 支持手机号或邮箱登录
      let phoneNumber = phone;
      if (email && !phone) {
        // 如果提供的是邮箱，尝试从用户表中查找对应的手机号
        const { AppDataSource } = await import('../config/database');
        const userRepository = AppDataSource.getRepository((await import('../models/User')).User);
        const userByEmail = await userRepository.findOne({ where: { email } });
        if (!userByEmail) {
          res.status(400).json({
            code: 400,
            message: '邮箱或密码错误',
            error: 'Email or password is incorrect'
          });
          return;
        }
        phoneNumber = userByEmail.phone;
      }

      if (!phoneNumber) {
        res.status(400).json({
          code: 400,
          message: '请求参数错误',
          error: 'Phone or email is required'
        });
        return;
      }

      // 调用登录服务
      const { user, token } = await this.authService.login(phoneNumber, password);

      // 返回用户信息和令牌
      res.status(200).json({
        code: 200,
        message: '登录成功',
        data: {
          id: user.id,
          phone: user.phone,
          nickname: user.nickname,
          avatar: user.avatar,
          email: user.email,
          role_id: user.role_id,
          status: user.status,
          token
        }
      });
    } catch (error) {
      console.error('登录控制器错误:', error);
      const errorMessage = error instanceof Error ? error.message : '登录失败';
      res.status(400).json({
        code: 400,
        message: errorMessage,
        error: errorMessage
      });
    }
  }

  // 管理员登录
  async adminLogin(req: Request, res: Response): Promise<void> {
    try {
      const { phone, password } = req.body;

      // 验证请求参数
      if (!phone || !password) {
        res.status(400).json({
          code: 400,
          message: '请求参数错误',
          error: 'Phone and password are required'
        });
        return;
      }

      // 调用管理员登录服务
      const { user, token } = await this.authService.adminLogin(phone, password);

      // 返回用户信息和令牌
      res.status(200).json({
        code: 200,
        message: '管理员登录成功',
        data: {
          id: user.id,
          phone: user.phone,
          nickname: user.nickname,
          avatar: user.avatar,
          email: user.email,
          role_id: user.role_id,
          status: user.status,
          token
        }
      });
    } catch (error) {
      console.error('管理员登录控制器错误:', error);
      const errorMessage = error instanceof Error ? error.message : '管理员登录失败';
      res.status(400).json({
        code: 400,
        message: errorMessage,
        error: errorMessage
      });
    }
  }

  // 退出登录
  async logout(req: Request, res: Response): Promise<void> {
    try {
      // 前端实现退出登录（清除本地存储的token）
      res.status(200).json({
        code: 200,
        message: '退出成功'
      });
    } catch (error) {
      console.error('退出登录控制器错误:', error);
      res.status(500).json({
        code: 500,
        message: '服务器内部错误',
        error: 'Internal server error'
      });
    }
  }
}