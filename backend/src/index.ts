import app from './app';
import { env } from './config/env';

// 启动服务器
const PORT = env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器已启动，运行在 http://localhost:${PORT}`);
  console.log(`API文档地址: http://localhost:${PORT}/docs`);
  console.log(`健康检查地址: http://localhost:${PORT}/health`);
});