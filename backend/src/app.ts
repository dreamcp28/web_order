import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/authRoutes';
import paymentRoutes from './routes/paymentRoutes';
import orderRoutes from './routes/orderRoutes';

// 创建Express应用
const app = express();

// 配置CORS
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));

// 配置解析JSON请求体
app.use(express.json({ limit: '10mb' }));

// 配置解析URL编码请求体
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 配置静态文件服务
app.use('/uploads', express.static('uploads'));

// API路由前缀
const API_PREFIX = '/api';

// 注册认证路由（必须在其他 /api 路由之前，确保优先匹配）
app.use(`${API_PREFIX}/auth`, authRoutes);

// 注册支付路由
app.use(API_PREFIX, paymentRoutes);

// 注册订单路由
app.use(API_PREFIX, orderRoutes);

// API 根路由 - 提供 API 信息（必须在最后，避免拦截其他路由）
app.get(API_PREFIX, (req, res) => {
  res.status(200).json({
    code: 200,
    message: 'API 服务运行正常',
    data: {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: `${API_PREFIX}/auth`,
        payment: `${API_PREFIX}/payment`,
        health: '/health'
      }
    }
  });
});

// 健康检查接口
app.get('/health', (req, res) => {
  res.status(200).json({
    code: 200,
    message: '服务器运行正常',
    data: {
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

// 404路由处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: 'API接口不存在',
    error: 'Not Found'
  });
});

// 全局错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('全局错误:', err);
  
  res.status(err.status || 500).json({
    code: err.status || 500,
    message: err.message || '服务器内部错误',
    error: err.stack || 'Internal server error'
  });
});

// 初始化数据库
initializeDatabase();

export default app;