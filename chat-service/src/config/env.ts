import dotenv from 'dotenv';

dotenv.config();

export const env = {
  // 服务器配置
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // 数据库配置
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
  DB_USERNAME: process.env.DB_USERNAME || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'ecommerce_db',
  
  // 后端API配置
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000',
};


