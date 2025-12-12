import dotenv from 'dotenv';

dotenv.config();

export const env = {
  // 服务器配置
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // 数据库配置
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
  DB_USERNAME: process.env.DB_USERNAME || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'ecommerce_db',
  
  // JWT配置
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // 支付配置
  WECHAT_APPID: process.env.WECHAT_APPID || '',
  WECHAT_MCHID: process.env.WECHAT_MCHID || '',
  WECHAT_APIKEY: process.env.WECHAT_APIKEY || '',
  WECHAT_GATEWAY: process.env.WECHAT_GATEWAY || 'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi',
  
  ALIPAY_APPID: process.env.ALIPAY_APPID || '',
  ALIPAY_PRIVATE_KEY: process.env.ALIPAY_PRIVATE_KEY || '',
  ALIPAY_PUBLIC_KEY: process.env.ALIPAY_PUBLIC_KEY || '',
  ALIPAY_GATEWAY: process.env.ALIPAY_GATEWAY || 'https://openapi.alipay.com/gateway.do',
  
  // 跨域配置
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // 前端URL配置
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
};

// 验证必要的环境变量
const requiredEnvVars = ['DB_PASSWORD', 'JWT_SECRET'];
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.warn(`Warning: ${varName} is not set in the environment variables.`);
  }
}