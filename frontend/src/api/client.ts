import axios from 'axios';

// 创建axios实例
// 使用相对路径，让 nginx 代理处理 API 请求
// 开发环境使用环境变量，生产环境使用相对路径
const getBaseURL = () => {
  // 如果设置了环境变量，使用环境变量
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // 开发环境使用 localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:3000/api';
  }
  // 生产环境使用相对路径，由 nginx 代理
  return '/api';
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    
    // 如果token存在，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 只返回响应数据
    return response.data;
  },
  (error) => {
    // 处理响应错误
    if (error.response) {
      // 服务器返回了错误状态码
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          window.location.href = '/login';
          break;
        case 403:
          // 禁止访问
          console.error('访问被禁止');
          break;
        case 404:
          // API不存在
          console.error('API接口不存在');
          break;
        case 500:
          // 服务器内部错误
          console.error('服务器内部错误');
          break;
        default:
          // 其他错误
          console.error(`请求错误: ${error.response.status}`);
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('没有收到服务器响应');
    } else {
      // 请求配置错误
      console.error('请求配置错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;