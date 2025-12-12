import app from './app';
import { env } from './config/env';

// 启动服务器
const PORT = env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`智能客服服务已启动，运行在 http://localhost:${PORT}`);
  console.log(`健康检查地址: http://localhost:${PORT}/health`);
});


