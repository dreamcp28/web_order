

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { register } from '../../api/authApi';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  agreement: boolean;
}

interface FormErrors {
  email: string;
  password: string;
  confirmPassword: string;
  agreement: string;
}

interface PasswordStrength {
  level: number;
  text: string;
  className: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 表单数据状态
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    agreement: false
  });

  // 表单错误状态
  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: '',
    password: '',
    confirmPassword: '',
    agreement: ''
  });

  // 其他状态
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    level: 0,
    text: '请输入密码',
    className: 'text-text-secondary'
  });
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    content: ''
  });



  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '用户注册 - 云商速构';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 邮箱验证
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 密码强度检测
  const checkPasswordStrength = (password: string): boolean => {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Za-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z\d]/.test(password)) strength++;
    
    const strengthMap = [
      { level: 0, text: '请输入密码', className: 'text-text-secondary' },
      { level: 1, text: '密码强度：弱', className: 'text-danger' },
      { level: 2, text: '密码强度：中', className: 'text-success' },
      { level: 3, text: '密码强度：强', className: 'text-success' }
    ];
    
    const currentStrength = strengthMap[Math.min(strength, 3)];
    setPasswordStrength(currentStrength);
    
    return strength >= 2;
  };

  // 表单验证
  const validateForm = (): boolean => {
    const errors: FormErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      agreement: ''
    };

    let isValid = true;

    // 邮箱验证
    if (!formData.email.trim()) {
      errors.email = '请输入邮箱';
      isValid = false;
    } else if (!validateEmail(formData.email.trim())) {
      errors.email = '请输入正确的邮箱格式';
      isValid = false;
    }

    // 密码验证
    if (!formData.password) {
      errors.password = '请输入密码';
      isValid = false;
    } else if (formData.password.length < 8 || formData.password.length > 20) {
      errors.password = '密码长度应为8-20位';
      isValid = false;
    } else if (!checkPasswordStrength(formData.password)) {
      errors.password = '密码应包含字母和数字';
      isValid = false;
    }

    // 确认密码验证
    if (!formData.confirmPassword) {
      errors.confirmPassword = '请确认密码';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致';
      isValid = false;
    }

    // 协议验证
    if (!formData.agreement) {
      errors.agreement = '请同意服务协议和隐私政策';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // 处理表单输入变化
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));

    // 实时验证（除了协议）
    if (field !== 'agreement') {
      // 延迟验证，避免输入过程中频繁验证
      setTimeout(() => {
        validateForm();
      }, 300);
    }
  };

  // 处理邮箱输入
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleInputChange('email', value);
  };

  // 处理密码输入
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('password', e.target.value);
    checkPasswordStrength(e.target.value);
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 调用注册API
      const response = await register({
        username: formData.email.split('@')[0], // 使用邮箱前缀作为用户名
        email: formData.email,
        password: formData.password
      });
      console.log('注册成功：', response);
      
      // 注册成功后跳转到登录页
      navigate('/login');
    } catch (error) {
      console.error('注册失败：', error);
      setFormErrors(prevErrors => ({
        ...prevErrors,
        email: '注册失败，请稍后重试'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 显示协议模态框
  const handleShowAgreement = (title: string, content: string) => {
    setModalContent({ title, content });
    setShowAgreementModal(true);
  };

  // 关闭协议模态框
  const handleCloseModal = () => {
    setShowAgreementModal(false);
  };

  // 渲染密码强度条
  const renderPasswordStrengthBars = () => {
    const strengthColors = ['bg-gray-200', styles.passwordStrengthWeak, styles.passwordStrengthMedium, styles.passwordStrengthStrong];
    const currentColor = strengthColors[Math.min(passwordStrength.level, 3)];

    return (
      <div className="flex space-x-1">
        <div className={`flex-1 h-1 ${passwordStrength.level >= 1 ? currentColor : 'bg-gray-200'} rounded`}></div>
        <div className={`flex-1 h-1 ${passwordStrength.level >= 2 ? currentColor : 'bg-gray-200'} rounded`}></div>
        <div className={`flex-1 h-1 ${passwordStrength.level >= 3 ? currentColor : 'bg-gray-200'} rounded`}></div>
      </div>
    );
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 主容器 */}
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* 注册表单卡片 */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
          {/* Logo和标题 */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-cloud text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-text-primary">云商速构</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">用户注册</h1>
            <p className="text-text-secondary">开启您的电商创业之旅</p>
          </div>

          {/* 注册表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 邮箱输入 */}
            <div className="space-y-2">
              <label htmlFor="email-input" className="block text-sm font-medium text-text-primary">邮箱 *</label>
              <div className="relative">
                <input 
                  type="email" 
                  id="email-input" 
                  name="email" 
                  placeholder="请输入邮箱"
                  className={`w-full pl-12 pr-4 py-3 border border-border-light rounded-lg ${styles.formInput}`}
                  value={formData.email}
                  onChange={handleEmailChange}
                  required
                />
                <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
              </div>
              {formErrors.email && (
                <div id="email-error" className={styles.errorMessage}>{formErrors.email}</div>
              )}
            </div>

            {/* 密码输入 */}
            <div className="space-y-2">
              <label htmlFor="password-input" className="block text-sm font-medium text-text-primary">密码 *</label>
              <div className="relative">
                <input 
                  type={isPasswordVisible ? 'text' : 'password'}
                  id="password-input" 
                  name="password" 
                  placeholder="请设置密码（8-20位，包含字母和数字）"
                  className={`w-full pl-12 pr-12 py-3 border border-border-light rounded-lg ${styles.formInput}`}
                  minLength={8}
                  maxLength={20}
                  value={formData.password}
                  onChange={handlePasswordChange}
                  required
                />
                <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                <button 
                  type="button" 
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  <i className={`fas ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {/* 密码强度指示器 */}
              <div className="space-y-2">
                {renderPasswordStrengthBars()}
                <div className={`text-xs ${passwordStrength.className}`}>{passwordStrength.text}</div>
              </div>
              {formErrors.password && (
                <div className={styles.errorMessage}>{formErrors.password}</div>
              )}
            </div>

            {/* 确认密码输入 */}
            <div className="space-y-2">
              <label htmlFor="confirm-password-input" className="block text-sm font-medium text-text-primary">确认密码 *</label>
              <div className="relative">
                <input 
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  id="confirm-password-input" 
                  name="confirmPassword" 
                  placeholder="请再次输入密码"
                  className={`w-full pl-12 pr-12 py-3 border border-border-light rounded-lg ${styles.formInput}`}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
                <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                <button 
                  type="button" 
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  <i className={`fas ${isConfirmPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {formErrors.confirmPassword && (
                <div className={styles.errorMessage}>{formErrors.confirmPassword}</div>
              )}
            </div>

            {/* 服务协议 */}
            <div className="space-y-2">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="agreement" 
                  className="mt-1 w-4 h-4 text-primary border-border-light rounded focus:ring-primary"
                  checked={formData.agreement}
                  onChange={(e) => handleInputChange('agreement', e.target.checked)}
                  required
                />
                <span className="text-sm text-text-secondary leading-relaxed">
                  我已阅读并同意
                  <button 
                    type="button"
                    onClick={() => handleShowAgreement('服务协议', '这里是服务协议的详细内容...')}
                    className="text-primary hover:text-blue-600 underline ml-1 mr-1"
                  >
                    《服务协议》
                  </button>
                  和
                  <button 
                    type="button"
                    onClick={() => handleShowAgreement('隐私政策', '这里是隐私政策的详细内容...')}
                    className="text-primary hover:text-blue-600 underline ml-1"
                  >
                    《隐私政策》
                  </button>
                </span>
              </label>
              {formErrors.agreement && (
                <div className={styles.errorMessage}>{formErrors.agreement}</div>
              )}
            </div>

            {/* 注册按钮 */}
            <button 
              type="submit" 
              className={`w-full py-3 bg-primary text-white rounded-lg font-semibold text-lg ${styles.btnPrimary} hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  注册中...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus mr-2"></i>
                  注册
                </>
              )}
            </button>
          </form>

          {/* 登录链接 */}
          <div className="text-center mt-6 pt-6 border-t border-border-light">
            <p className="text-text-secondary">
              已有账号？
              <Link to="/login" className="text-primary hover:text-blue-600 font-medium ml-1">立即登录</Link>
            </p>
          </div>
        </div>
      </div>

      {/* 服务协议模态框 */}
      {showAgreementModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border-light relative">
              <h3 className="text-lg font-semibold text-text-primary">{modalContent.title}</h3>
              <button 
                onClick={handleCloseModal}
                className="absolute top-6 right-6 text-text-secondary hover:text-text-primary"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="text-sm text-text-secondary leading-relaxed">
                {modalContent.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;

