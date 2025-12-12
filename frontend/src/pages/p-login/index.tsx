

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { login } from '../../api/authApi';
import { useAuth } from '../../contexts/AuthContext';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();
  
  // 表单数据状态
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });

  // 错误信息状态
  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: '',
    password: ''
  });

  // UI状态
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isLoadingOverlayVisible, setIsLoadingOverlayVisible] = useState(false);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '用户登录 - 云商速构';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 邮箱格式验证
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 密码格式验证
  const validatePassword = (password: string): boolean => {
    // 密码至少6位
    return password.length >= 6;
  };

  // 显示错误信息
  const showFormError = (field: keyof FormErrors, message: string) => {
    setFormErrors(prev => ({
      ...prev,
      [field]: message
    }));
  };

  // 隐藏错误信息
  const hideFormError = (field: keyof FormErrors) => {
    setFormErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  // 邮箱输入处理
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, email: value }));
    hideFormError('email');
  };

  // 密码输入处理
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, password: value }));
    hideFormError('password');
  };

  // 表单提交处理
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const email = formData.email.trim();
    const password = formData.password.trim();
    
    // 验证表单
    let hasError = false;
    
    if (!email) {
      showFormError('email', '请输入邮箱');
      hasError = true;
    } else if (!validateEmail(email)) {
      showFormError('email', '请输入正确的邮箱格式');
      hasError = true;
    } else {
      hideFormError('email');
    }
    
    if (!password) {
      showFormError('password', '请输入密码');
      hasError = true;
    } else if (!validatePassword(password)) {
      showFormError('password', '密码至少6位');
      hasError = true;
    } else {
      hideFormError('password');
    }
    
    if (hasError) {
      return;
    }
    
    // 显示加载状态
    setIsSubmittingLogin(true);
    setIsLoadingOverlayVisible(true);
    
    try {
      // 调用登录API
      const response = await login({ email, password });
      console.log('登录成功：', response);
      
      // 更新认证上下文
      if (response.user && response.token) {
        loginContext(response.user, response.token);
      }
      
      // 隐藏加载状态
      setIsLoadingOverlayVisible(false);
      setIsSubmittingLogin(false);
      
      // 登录成功，跳转到首页
      navigate('/home');
    } catch (error) {
      console.error('登录失败：', error);
      
      // 隐藏加载状态
      setIsLoadingOverlayVisible(false);
      setIsSubmittingLogin(false);
      
      // 显示通用错误信息
      showFormError('email', '登录失败，请检查邮箱和密码是否正确');
    }
  };

  // 忘记密码处理
  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('忘记密码功能即将上线，敬请期待');
  };

  // 帮助中心处理
  const handleHelpCenterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('帮助中心功能即将上线，敬请期待');
  };

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC键关闭加载遮罩
      if (e.key === 'Escape' && isLoadingOverlayVisible) {
        setIsLoadingOverlayVisible(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLoadingOverlayVisible]);

  return (
    <div className={styles.pageWrapper}>
      {/* 主容器 */}
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* 登录卡片 */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
          {/* Logo和标题 */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-cloud text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-text-primary">云商速构</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">欢迎回来</h1>
            <p className="text-text-secondary">请登录您的账号</p>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* 邮箱输入 */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                邮箱
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-text-secondary"></i>
                </div>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  placeholder="请输入邮箱" 
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg ${styles.formInput} ${formErrors.email ? 'border-danger' : 'border-border-light'}`}
                  value={formData.email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              {formErrors.email && (
                <div className={styles.errorMessage}>{formErrors.email}</div>
              )}
            </div>

            {/* 密码输入 */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-text-secondary"></i>
                </div>
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  placeholder="请输入密码" 
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg ${styles.formInput} ${formErrors.password ? 'border-danger' : 'border-border-light'}`}
                  value={formData.password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              {formErrors.password && (
                <div className={styles.errorMessage}>{formErrors.password}</div>
              )}
            </div>

            {/* 登录按钮 */}
            <button 
              type="submit" 
              disabled={isSubmittingLogin}
              className={`w-full py-3 ${styles.btnPrimary} rounded-lg text-lg font-semibold`}
            >
              {isSubmittingLogin ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  登录中...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  登录
                </>
              )}
            </button>
          </form>

          {/* 注册链接 */}
          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              还没有账号？
              <Link to="/register" className="text-primary hover:text-blue-700 font-medium ml-1">
                立即注册
              </Link>
            </p>
          </div>

          {/* 帮助链接 */}
          <div className="mt-6 pt-6 border-t border-border-light">
            <div className="flex justify-center space-x-6 text-sm">
              <a 
                href="#" 
                onClick={handleForgotPasswordClick}
                className="text-text-secondary hover:text-primary"
              >
                忘记密码？
              </a>
              <a 
                href="#" 
                onClick={handleHelpCenterClick}
                className="text-text-secondary hover:text-primary"
              >
                帮助中心
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 加载遮罩 */}
      {isLoadingOverlayVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-text-primary">登录中...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

