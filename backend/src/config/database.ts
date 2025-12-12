import { DataSource } from 'typeorm';
import { env } from './env';
import { join } from 'path';

// 创建数据库连接源
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [join(__dirname, '../models/*.{ts,js}')],
  migrations: [join(__dirname, '../migrations/*.{ts,js}')],
  subscribers: [join(__dirname, '../subscribers/*.{ts,js}')],
  synchronize: env.NODE_ENV === 'development', // 开发环境自动同步数据库结构
  logging: env.NODE_ENV === 'development', // 开发环境显示SQL日志
  poolSize: 10, // 数据库连接池大小
  connectorPackage: 'mysql2', // 使用mysql2驱动
  extra: {
    charset: 'utf8mb4_unicode_ci', // 支持Emoji等特殊字符
  },
});

// 初始化数据库连接
export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully!');
  } catch (error) {
    console.error('Error establishing database connection:', error);
    // 数据库连接失败时不退出进程，仅记录错误
    console.warn('Server will continue running without database connection...');
  }
};