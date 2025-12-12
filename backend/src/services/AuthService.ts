import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { generateToken } from '../config/jwt';

// 认证服务类
export class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private roleRepository = AppDataSource.getRepository(Role);
  
  // 用户注册
  async register(phone: string, password: string, nickname?: string): Promise<User> {
    try {
      // 检查手机号是否已注册
      const existingUser = await this.userRepository.findOneBy({ phone });
      if (existingUser) {
        throw new Error('手机号已注册');
      }

      // 获取默认角色（普通用户）
      const userRole = await this.roleRepository.findOneBy({ name: 'user' });
      if (!userRole) {
        throw new Error('默认角色不存在');
      }

      // 密码哈希
      const hashedPassword = await bcrypt.hash(password, 10);

      // 创建新用户
      const newUser = new User();
      newUser.phone = phone;
      newUser.password = hashedPassword;
      newUser.nickname = nickname || `用户${phone.slice(-4)}`;
      newUser.role = userRole;
      newUser.role_id = userRole.id;
      newUser.status = 'active';

      // 保存用户
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.error('注册服务错误:', error);
      throw error;
    }
  }

  // 用户登录
  async login(phone: string, password: string): Promise<{ user: User; token: string }> {
    try {
      // 查找用户
      const user = await this.userRepository.findOne({
        where: { phone },
        relations: ['role']
      });

      if (!user) {
        throw new Error('手机号或密码错误');
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('手机号或密码错误');
      }

      // 检查用户状态
      if (user.status !== 'active') {
        throw new Error('用户账户已被禁用');
      }

      // 生成JWT令牌
      const token = generateToken({
        id: user.id,
        phone: user.phone,
        role_id: user.role_id,
        nickname: user.nickname,
        avatar: user.avatar
      });

      return { user, token };
    } catch (error) {
      console.error('登录服务错误:', error);
      throw error;
    }
  }

  // 管理员登录
  async adminLogin(phone: string, password: string): Promise<{ user: User; token: string }> {
    try {
      // 查找用户
      const user = await this.userRepository.findOne({
        where: { phone },
        relations: ['role']
      });

      if (!user) {
        throw new Error('手机号或密码错误');
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('手机号或密码错误');
      }

      // 检查用户角色
      if (!user.role || (user.role.name !== 'admin' && user.role.name !== 'super_admin')) {
        throw new Error('权限不足，需要管理员权限');
      }

      // 检查用户状态
      if (user.status !== 'active') {
        throw new Error('用户账户已被禁用');
      }

      // 生成JWT令牌
      const token = generateToken({
        id: user.id,
        phone: user.phone,
        role_id: user.role_id,
        nickname: user.nickname,
        avatar: user.avatar
      });

      return { user, token };
    } catch (error) {
      console.error('管理员登录服务错误:', error);
      throw error;
    }
  }
}