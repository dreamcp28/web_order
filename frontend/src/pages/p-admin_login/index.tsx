

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface ValidationErrors {
  username: boolean;
  password: boolean;
}

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 表单数据状态
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false
  });

  // 验证错误状态
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    username: false,
    password: false
  });

  // UI状态
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorText, _setErrorText] = useState('用户名或密码错误，请重试');
  const [successText, _setSuccessText] = useState('登录成功，正在跳转...');

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '管理后台登录 - 云商速构';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 页面加载时检查记住密码
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rememberedUsername = localStorage.getItem('admin_username');
      const rememberMe = localStorage.getItem('admin_remember') === 'true';
      
      if (rememberedUsername && rememberMe) {
        setFormData(prev => ({
          ...prev,
          username: rememberedUsername,
          rememberMe: true
        }));
      }
    }
  }, []);

  // 处理输入框变化
  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 清除相关错误信息
    if (field === 'username' || field === 'password') {
      setValidationErrors(prev => ({
        ...prev,
        [field]: false
      }));
      setShowErrorMessage(false);
    }
  };

  // 验证用户名
  const validateUsername = (): boolean => {
    const isEmpty = !formData.username.trim();
    setValidationErrors(prev => ({
      ...prev,
      username: isEmpty
    }));
    return !isEmpty;
  };

  // 验证密码
  const validatePassword = (): boolean => {
    const isEmpty = !formData.password.trim();
    setValidationErrors(prev => ({
      ...prev,
      password: isEmpty
    }));
    return !isEmpty;
  };

  // 处理输入框失焦
  const handleInputBlur = (field: 'username' | 'password') => {
    if (field === 'username') {
      validateUsername();
    } else {
      validatePassword();
    }
  };

  // 切换密码显示状态
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 处理表单提交
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 清除之前的消息
    setShowErrorMessage(false);
    setShowSuccessMessage(false);
    
    // 验证表单
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();
    
    if (!isUsernameValid || !isPasswordValid) {
      return;
    }
    
    // 显示加载状态
    setIsLoading(true);
    
    // 模拟登录请求
    setTimeout(() => {
      // 简单的演示验证（实际项目中应该由后端验证）
      if (formData.username && formData.password) {
        // 登录成功
        setShowSuccessMessage(true);
        
        // 记住密码（实际项目中应该加密存储）
        if (typeof window !== 'undefined' && formData.rememberMe) {
          localStorage.setItem('admin_username', formData.username);
          localStorage.setItem('admin_remember', 'true');
        }
        
        // 跳转到管理后台首页
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 1500);
      } else {
        // 登录失败
        setIsLoading(false);
        setShowErrorMessage(true);
      }
    }, 1500);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent, nextFieldId?: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (nextFieldId) {
        const nextInput = document.getElementById(nextFieldId);
        if (nextInput) {
          nextInput.focus();
        }
      } else {
        handleFormSubmit(e as any);
      }
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 登录容器 */}
      <div className="w-full max-w-md">
        {/* 登录卡片 */}
        <div className="bg-white rounded-2xl shadow-login overflow-hidden">
          {/* 卡片头部 */}
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <i className="fas fa-shield-alt text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold">云商速构管理后台</span>
            </div>
            <h1 className="text-xl font-semibold mb-2">管理员登录</h1>
            <p className="text-sm opacity-90">请输入您的管理员账号和密码</p>
          </div>
          
          {/* 卡片主体 */}
          <div className="p-8">
            {/* 消息提示区域 */}
            <div className="mb-6">
              <div className={`${styles.errorMessage} ${showErrorMessage ? styles.show : ''} bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm`}>
                <i className="fas fa-exclamation-circle mr-2"></i>
                <span>{errorText}</span>
              </div>
              <div className={`${styles.successMessage} ${showSuccessMessage ? styles.show : ''} bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm`}>
                <i className="fas fa-check-circle mr-2"></i>
                <span>{successText}</span>
              </div>
            </div>
            
            {/* 登录表单 */}
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* 用户名输入 */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-text-primary">
                  <i className="fas fa-user mr-2 text-primary"></i>用户名
                </label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInput} transition-all duration-200`}
                  placeholder="请输入管理员用户名"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  onBlur={() => handleInputBlur('username')}
                  onKeyDown={(e) => handleKeyDown(e, 'password')}
                  required
                />
                {validationErrors.username && (
                  <div className="text-red-500 text-xs">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    <span>请输入用户名</span>
                  </div>
                )}
              </div>
              
              {/* 密码输入 */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                  <i className="fas fa-lock mr-2 text-primary"></i>密码
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    id="password" 
                    name="password" 
                    className={`w-full px-4 py-3 pr-12 border border-border-light rounded-lg ${styles.formInput} transition-all duration-200`}
                    placeholder="请输入密码"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={() => handleInputBlur('password')}
                    onKeyDown={(e) => handleKeyDown(e)}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {validationErrors.password && (
                  <div className="text-red-500 text-xs">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    <span>请输入密码</span>
                  </div>
                )}
              </div>
              
              {/* 记住密码 */}
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember-me" 
                  name="remember-me" 
                  className="w-4 h-4 text-primary border-border-light rounded focus:ring-primary focus:ring-2"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-text-secondary">记住密码</label>
              </div>
              
              {/* 登录按钮 */}
              <button 
                type="submit" 
                disabled={isLoading}
                className={`${styles.loginButton} w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50`}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    <span>登录中...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    <span>登录</span>
                  </>
                )}
              </button>
            </form>
            
            {/* 底部链接 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-text-secondary">
                忘记密码？请联系系统管理员
              </p>
            </div>
          </div>
        </div>
        
        {/* 版权信息 */}
        <div className="mt-6 text-center text-sm text-text-secondary">
          <p>&copy; 2024 云商速构. 保留所有权利</p>
        </div>
      </div>
      
      {/* 加载遮罩 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-text-primary">正在登录...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLoginPage;

