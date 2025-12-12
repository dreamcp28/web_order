import apiClient from './client';

// 定义API响应类型
interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
}

interface RegisterResponse {
  message: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

// 用户注册接口
export const register = async (userData: {
  username?: string;
  email: string;
  password: string;
  phone?: string;
  nickname?: string;
}): Promise<RegisterResponse> => {
  try {
    // 后端支持 email 或 phone，优先使用 email
    const requestData = {
      email: userData.email,
      password: userData.password,
      nickname: userData.nickname || userData.username || userData.email.split('@')[0]
    };
    const response = await apiClient.post('/auth/register', requestData);
    return response as unknown as RegisterResponse;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
};

// 用户登录接口
export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    // 后端支持 email 或 phone 登录
    const response = await apiClient.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    const loginData = response.data as LoginResponse;
    
    // 保存token和用户信息到localStorage
    if (loginData && loginData.token) {
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('userInfo', JSON.stringify(loginData.user || {}));
    }
    
    return loginData;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

// 用户登出接口
export const logout = () => {
  // 清除localStorage中的token和用户信息
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  
  // 跳转到登录页
  window.location.href = '/login';
};

// 获取当前用户信息
export const getCurrentUser = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

// 检查用户是否已登录
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// 用户认证API接口集合
const authApi = {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
};

export default authApi;