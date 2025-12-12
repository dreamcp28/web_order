import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

// 创建认证路由
const authRouter = Router();
const authController = new AuthController();

// 用户注册
authRouter.post('/register', authController.register.bind(authController));

// 用户登录
authRouter.post('/login', authController.login.bind(authController));

// 管理员登录
authRouter.post('/admin/login', authController.adminLogin.bind(authController));

// 退出登录
authRouter.post('/logout', authController.logout.bind(authController));

export default authRouter;