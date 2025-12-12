

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface PaymentFormData {
  wechatAppid: string;
  wechatMchid: string;
  wechatApikey: string;
  wechatGateway: string;
  alipayAppid: string;
  alipayPrivateKey: string;
  alipayPublicKey: string;
  alipayGateway: string;
}

const PaymentConfigPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 侧边栏状态
  const [isSidebarCollapsed, _setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  
  // 密码显示状态
  const [showWechatApikey, setShowWechatApikey] = useState(false);
  const [showAlipayPrivateKey, setShowAlipayPrivateKey] = useState(false);
  const [showAlipayPublicKey, setShowAlipayPublicKey] = useState(false);
  
  // 文件上传状态
  const [isFileUploaded, setIsFileUploaded] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // 表单数据
  const [formData, setFormData] = useState<PaymentFormData>({
    wechatAppid: 'wx1234567890abcdef',
    wechatMchid: '1234567890',
    wechatApikey: 'your_api_v3_key_here',
    wechatGateway: 'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi',
    alipayAppid: '',
    alipayPrivateKey: '',
    alipayPublicKey: '',
    alipayGateway: 'https://openapi.alipay.com/gateway.do'
  });
  
  // 其他状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Partial<PaymentFormData>>({});
  
  // 文件输入引用
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '支付配置 - 云商速构管理后台';
    return () => {
      document.title = originalTitle;
    };
  }, []);
  
  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarVisible(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // 处理输入变化
  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 清除验证错误
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  
  // 切换密码显示
  const togglePasswordVisibility = (field: 'wechatApikey' | 'alipayPrivateKey' | 'alipayPublicKey') => {
    switch (field) {
      case 'wechatApikey':
        setShowWechatApikey(!showWechatApikey);
        break;
      case 'alipayPrivateKey':
        setShowAlipayPrivateKey(!showAlipayPrivateKey);
        break;
      case 'alipayPublicKey':
        setShowAlipayPublicKey(!showAlipayPublicKey);
        break;
    }
  };
  
  // 处理文件上传
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.size > 2 * 1024 * 1024) {
      alert('文件大小不能超过2MB');
      return;
    }
    
    setIsFileUploaded(true);
  };
  
  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };
  
  // 表单验证
  const validateForm = (): boolean => {
    const errors: Partial<PaymentFormData> = {};
    
    if (!formData.wechatAppid.trim()) errors.wechatAppid = '请输入微信支付APPID';
    if (!formData.wechatMchid.trim()) errors.wechatMchid = '请输入微信支付商户号';
    if (!formData.wechatApikey.trim()) errors.wechatApikey = '请输入APIv3密钥';
    if (!formData.alipayAppid.trim()) errors.alipayAppid = '请输入支付宝APP_ID';
    if (!formData.alipayPrivateKey.trim()) errors.alipayPrivateKey = '请输入应用私钥';
    if (!formData.alipayPublicKey.trim()) errors.alipayPublicKey = '请输入支付宝公钥';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // 表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('请填写所有必填字段');
      return;
    }
    
    setIsSubmitting(true);
    
    // 模拟保存过程
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 1500);
  };
  
  // 重置表单
  const handleReset = () => {
    if (confirm('确定要重置所有配置吗？')) {
      setFormData({
        wechatAppid: '',
        wechatMchid: '',
        wechatApikey: '',
        wechatGateway: '',
        alipayAppid: '',
        alipayPrivateKey: '',
        alipayPublicKey: '',
        alipayGateway: ''
      });
      setIsFileUploaded(false);
      setValidationErrors({});
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // 退出登录
  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      navigate('/admin-login');
    }
  };
  
  // 移动端侧边栏切换
  const toggleMobileSidebar = () => {
    setIsMobileSidebarVisible(!isMobileSidebarVisible);
  };
  
  // 关闭成功模态框
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* 左侧：Logo和菜单切换 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleMobileSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <i className="fas fa-bars text-gray-600"></i>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-cloud text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold text-text-primary">云商速构管理后台</span>
            </div>
          </div>
          
          {/* 右侧：用户操作 */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <i className="fas fa-bell text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
              <img 
                src="https://s.coze.cn/image/untOL_iyteU/" 
                alt="管理员头像" 
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-text-primary hidden md:block">管理员</span>
              <i className="fas fa-chevron-down text-xs text-text-secondary hidden md:block"></i>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 text-text-secondary"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </header>

      {/* 主容器 */}
      <div className="flex pt-16">
        {/* 左侧菜单 */}
        <aside className={`fixed left-0 top-16 bottom-0 bg-white border-r border-border-light transition-all duration-300 z-40 lg:relative lg:top-0 ${
          isMobileSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded
        }`}>
          <div className="h-full overflow-y-auto">
            {/* 管理功能菜单 */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">管理功能</h3>
              <nav className="space-y-1">
                <Link 
                  to="/admin-dashboard" 
                  className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}
                >
                  <i className="fas fa-tachometer-alt w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>仪表盘</span>
                </Link>
                <Link 
                  to="/product-manage" 
                  className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}
                >
                  <i className="fas fa-box w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>商品管理</span>
                </Link>
                <Link 
                  to="/order-manage" 
                  className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}
                >
                  <i className="fas fa-receipt w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>订单管理</span>
                </Link>
                <Link 
                  to="/payment-config" 
                  className={`${styles.navLinkActive} flex items-center px-3 py-2 rounded-lg text-sm`}
                >
                  <i className="fas fa-credit-card w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>支付配置</span>
                </Link>
                <Link 
                  to="/security-settings" 
                  className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}
                >
                  <i className="fas fa-shield-alt w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>安全设置</span>
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="p-6">
            {/* 页面头部 */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">支付配置</h1>
                  <nav className="mt-1">
                    <ol className="flex items-center space-x-2 text-sm text-text-secondary">
                      <li><Link to="/admin-dashboard" className="hover:text-primary">管理后台</Link></li>
                      <li><i className="fas fa-chevron-right text-xs"></i></li>
                      <li>支付配置</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>

            {/* 配置表单 */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 微信支付配置 */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-success bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                    <i className="fab fa-weixin text-success text-xl"></i>
                  </div>
                  <h2 className="text-xl font-semibold text-text-primary">微信支付配置</h2>
                  <span className="ml-3 px-2 py-1 bg-success bg-opacity-10 text-success text-xs rounded-full">已配置</span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="wechat-appid" className="block text-sm font-medium text-text-primary mb-2">
                        APPID <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="wechat-appid" 
                        value={formData.wechatAppid}
                        onChange={(e) => handleInputChange('wechatAppid', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg ${styles.formInput} ${
                          validationErrors.wechatAppid ? 'border-danger' : 'border-border-light'
                        }`}
                        placeholder="请输入微信支付APPID"
                      />
                      {validationErrors.wechatAppid && (
                        <p className="text-danger text-sm mt-1">{validationErrors.wechatAppid}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="wechat-mchid" className="block text-sm font-medium text-text-primary mb-2">
                        商户号(MCHID) <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="wechat-mchid" 
                        value={formData.wechatMchid}
                        onChange={(e) => handleInputChange('wechatMchid', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg ${styles.formInput} ${
                          validationErrors.wechatMchid ? 'border-danger' : 'border-border-light'
                        }`}
                        placeholder="请输入微信支付商户号"
                      />
                      {validationErrors.wechatMchid && (
                        <p className="text-danger text-sm mt-1">{validationErrors.wechatMchid}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="wechat-apikey" className="block text-sm font-medium text-text-primary mb-2">
                        APIv3密钥 <span className="text-danger">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          type={showWechatApikey ? 'text' : 'password'}
                          id="wechat-apikey" 
                          value={formData.wechatApikey}
                          onChange={(e) => handleInputChange('wechatApikey', e.target.value)}
                          className={`w-full px-4 py-2 pr-10 border rounded-lg ${styles.formInput} ${
                            validationErrors.wechatApikey ? 'border-danger' : 'border-border-light'
                          }`}
                          placeholder="请输入APIv3密钥"
                        />
                        <button 
                          type="button" 
                          onClick={() => togglePasswordVisibility('wechatApikey')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                        >
                          <i className={`fas ${showWechatApikey ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                      {validationErrors.wechatApikey && (
                        <p className="text-danger text-sm mt-1">{validationErrors.wechatApikey}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="wechat-certificate" className="block text-sm font-medium text-text-primary mb-2">
                        API客户端证书 <span className="text-danger">*</span>
                      </label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`${styles.uploadArea} ${isDragOver ? styles.uploadAreaDragover : ''} rounded-lg p-6 text-center cursor-pointer`}
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={(e) => handleFileUpload(e.target.files)}
                          accept=".p12,.pfx" 
                          className="hidden"
                        />
                        {!isFileUploaded ? (
                          <div className="space-y-2">
                            <i className="fas fa-cloud-upload-alt text-3xl text-text-secondary"></i>
                            <p className="text-sm text-text-secondary">点击上传或拖拽文件到此处</p>
                            <p className="text-xs text-text-secondary">支持 .p12 或 .pfx 格式，文件大小不超过 2MB</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <i className="fas fa-check-circle text-3xl text-success"></i>
                            <p className="text-sm text-success">证书已上传</p>
                            <p className="text-xs text-text-secondary">apiclient_cert.p12</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="wechat-gateway" className="block text-sm font-medium text-text-primary mb-2">
                        支付网关URL
                      </label>
                      <input 
                        type="url" 
                        id="wechat-gateway" 
                        value={formData.wechatGateway}
                        onChange={(e) => handleInputChange('wechatGateway', e.target.value)}
                        className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInput}`}
                        placeholder="请输入微信支付网关URL"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 支付宝支付配置 */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-info bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                    <i className="fab fa-alipay text-info text-xl"></i>
                  </div>
                  <h2 className="text-xl font-semibold text-text-primary">支付宝支付配置</h2>
                  <span className="ml-3 px-2 py-1 bg-warning bg-opacity-10 text-warning text-xs rounded-full">待配置</span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="alipay-appid" className="block text-sm font-medium text-text-primary mb-2">
                        APP_ID <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="alipay-appid" 
                        value={formData.alipayAppid}
                        onChange={(e) => handleInputChange('alipayAppid', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg ${styles.formInput} ${
                          validationErrors.alipayAppid ? 'border-danger' : 'border-border-light'
                        }`}
                        placeholder="请输入支付宝APP_ID"
                      />
                      {validationErrors.alipayAppid && (
                        <p className="text-danger text-sm mt-1">{validationErrors.alipayAppid}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="alipay-private-key" className="block text-sm font-medium text-text-primary mb-2">
                        应用私钥 <span className="text-danger">*</span>
                      </label>
                      <div className="relative">
                        <textarea 
                          id="alipay-private-key" 
                          rows={6}
                          value={formData.alipayPrivateKey}
                          onChange={(e) => handleInputChange('alipayPrivateKey', e.target.value)}
                          className={`w-full px-4 py-2 pr-10 border rounded-lg ${styles.formInput} resize-none ${
                            validationErrors.alipayPrivateKey ? 'border-danger' : 'border-border-light'
                          }`}
                          placeholder="请输入应用私钥"
                        />
                        <button 
                          type="button" 
                          onClick={() => togglePasswordVisibility('alipayPrivateKey')}
                          className="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
                        >
                          <i className={`fas ${showAlipayPrivateKey ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                      {validationErrors.alipayPrivateKey && (
                        <p className="text-danger text-sm mt-1">{validationErrors.alipayPrivateKey}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="alipay-public-key" className="block text-sm font-medium text-text-primary mb-2">
                        支付宝公钥 <span className="text-danger">*</span>
                      </label>
                      <div className="relative">
                        <textarea 
                          id="alipay-public-key" 
                          rows={6}
                          value={formData.alipayPublicKey}
                          onChange={(e) => handleInputChange('alipayPublicKey', e.target.value)}
                          className={`w-full px-4 py-2 pr-10 border rounded-lg ${styles.formInput} resize-none ${
                            validationErrors.alipayPublicKey ? 'border-danger' : 'border-border-light'
                          }`}
                          placeholder="请输入支付宝公钥"
                        />
                        <button 
                          type="button" 
                          onClick={() => togglePasswordVisibility('alipayPublicKey')}
                          className="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
                        >
                          <i className={`fas ${showAlipayPublicKey ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                      {validationErrors.alipayPublicKey && (
                        <p className="text-danger text-sm mt-1">{validationErrors.alipayPublicKey}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="alipay-gateway" className="block text-sm font-medium text-text-primary mb-2">
                        支付网关URL
                      </label>
                      <input 
                        type="url" 
                        id="alipay-gateway" 
                        value={formData.alipayGateway}
                        onChange={(e) => handleInputChange('alipayGateway', e.target.value)}
                        className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInput}`}
                        placeholder="请输入支付宝支付网关URL"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={handleReset}
                  className="px-6 py-2 border border-border-light text-text-primary rounded-lg hover:bg-gray-50 transition-colors"
                >
                  重置
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      保存中...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      保存配置
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* 侧边栏遮罩（移动端） */}
      {isMobileSidebarVisible && (
        <div 
          onClick={toggleMobileSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        ></div>
      )}

      {/* 成功提示模态框 */}
      {showSuccessModal && (
        <div 
          onClick={closeSuccessModal}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-success text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">配置保存成功</h3>
              <p className="text-text-secondary mb-6">支付配置已更新，新的配置将立即生效</p>
              <button 
                onClick={closeSuccessModal}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentConfigPage;

