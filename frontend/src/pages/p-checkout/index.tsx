

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 状态管理
  const [isSidebarCollapsed, _setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  const [receiverType, setReceiverType] = useState<'email' | 'phone'>('email');
  const [receiverInfo, setReceiverInfo] = useState('');
  const [receiverError, setReceiverError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('alipay');
  const [isPayButtonDisabled, setIsPayButtonDisabled] = useState(true);

  // 模拟商品数据
  const mockProducts: Record<string, Product> = {
    '1': {
      id: '1',
      name: '电商系统基础版 - 快速上线解决方案',
      description: '包含完整的电商核心功能，支持快速部署上线',
      price: 2999,
      image: 'https://s.coze.cn/image/H9vDvZrDrkk/'
    },
    '2': {
      id: '2',
      name: '企业级电商平台 - 全功能定制版',
      description: '企业级电商解决方案，支持多端部署和定制开发',
      price: 8999,
      image: 'https://s.coze.cn/image/o4ET1_bYSIY/'
    },
    '3': {
      id: '3',
      name: '智能客服系统 - 7x24小时在线服务',
      description: 'AI智能客服系统，支持多渠道接入和智能回复',
      price: 1599,
      image: 'https://s.coze.cn/image/gchhF-pOAx0/'
    },
    '4': {
      id: '4',
      name: 'DevOps自动化部署 - 一键上线运维',
      description: '自动化部署和运维解决方案，支持CI/CD流程',
      price: 3999,
      image: 'https://s.coze.cn/image/ENwXrC58A0U/'
    }
  };

  // 获取当前商品信息
  const productId = searchParams.get('product') || '1';
  const currentProduct = mockProducts[productId] || mockProducts['1'];

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '结算支付 - 云商速构';
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

  // 验证接收信息
  const validateReceiverInfo = (value: string): boolean => {
    if (!value.trim()) {
      setReceiverError(receiverType === 'email' ? '请输入您的邮箱地址' : '请输入您的手机号码');
      return false;
    }

    const isValid = receiverType === 'email'
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      : /^1[3-9]\d{9}$/.test(value);

    if (!isValid) {
      setReceiverError(receiverType === 'email' ? '请输入有效的邮箱地址' : '请输入有效的手机号码');
      return false;
    }

    setReceiverError('');
    return true;
  };

  // 更新支付按钮状态
  useEffect(() => {
    const isValid = validateReceiverInfo(receiverInfo);
    setIsPayButtonDisabled(!isValid);
  }, [receiverInfo, receiverType]);

  // 处理搜索
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const keyword = (e.target as HTMLInputElement).value.trim();
      if (keyword) {
        navigate(`/product-list?search=${encodeURIComponent(keyword)}`);
      }
    }
  };

  // 处理接收类型切换
  const handleReceiverTypeChange = (type: 'email' | 'phone') => {
    setReceiverType(type);
    setReceiverInfo('');
    setReceiverError('');
  };

  // 处理接收信息输入
  const handleReceiverInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceiverInfo(e.target.value);
  };

  // 处理支付方式选择
  const handlePaymentMethodChange = (method: 'wechat' | 'alipay') => {
    setPaymentMethod(method);
  };

  // 处理支付
  const handlePayNow = () => {
    if (!isPayButtonDisabled) {
      const orderId = 'ORD' + Date.now();
      navigate(`/order-confirm?orderId=${orderId}&productId=${productId}&paymentMethod=${paymentMethod}&receiver=${encodeURIComponent(receiverInfo)}`);
    }
  };

  // 移动端侧边栏切换
  const toggleMobileSidebar = () => {
    setIsMobileSidebarVisible(!isMobileSidebarVisible);
  };

  // 关闭移动端侧边栏
  const closeMobileSidebar = () => {
    setIsMobileSidebarVisible(false);
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
              <span className="text-xl font-bold text-text-primary">云商速构</span>
            </div>
          </div>
          
          {/* 中间：搜索框 */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input 
                type="text" 
                placeholder="搜索商品..." 
                className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchInput}`}
                onKeyPress={handleSearchKeyPress}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
            </div>
          </div>
          
          {/* 右侧：用户操作 */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <i className="fas fa-shopping-cart text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center">0</span>
            </button>
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <i className="fas fa-bell text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full"></span>
            </button>
            <Link to="/user-center" className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
              <img 
                src="https://s.coze.cn/image/TmkyK4j-U9E/" 
                alt="用户头像" 
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-text-primary hidden md:block">张三</span>
              <i className="fas fa-chevron-down text-xs text-text-secondary hidden md:block"></i>
            </Link>
          </div>
        </div>
      </header>

      {/* 主容器 */}
      <div className="flex pt-16">
        {/* 左侧菜单 */}
        <aside className={`fixed left-0 top-16 bottom-0 bg-white border-r border-border-light transition-all duration-300 z-40 lg:relative lg:top-0 ${
          isMobileSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded}`}>
          <div className="h-full overflow-y-auto">
            {/* 商品分类 */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">商品分类</h3>
              <nav className="space-y-1">
                <Link to="/product-list?category=all" className={`${styles.categoryItem} flex items-center px-3 py-2 rounded-lg text-sm text-primary bg-blue-50`}>
                  <i className="fas fa-th-large w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>全部商品</span>
                </Link>
                <Link to="/product-list?category=virtual" className={`${styles.categoryItem} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-key w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>虚拟商品</span>
                </Link>
                <Link to="/product-list?category=software" className={`${styles.categoryItem} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-laptop-code w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>软件工具</span>
                </Link>
                <Link to="/product-list?category=service" className={`${styles.categoryItem} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-handshake w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>技术服务</span>
                </Link>
                <Link to="/product-list?category=template" className={`${styles.categoryItem} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-layer-group w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>网站模板</span>
                </Link>
              </nav>
            </div>
            
            {/* 快捷入口 */}
            <div className="p-4 border-t border-border-light">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">快捷入口</h3>
              <nav className="space-y-1">
                <Link to="/user-center" className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-receipt w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>我的订单</span>
                </Link>
                <Link to="#" className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-heart w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>收藏夹</span>
                </Link>
                <Link to="/chat-support" className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-question-circle w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>帮助中心</span>
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
              <h1 className="text-2xl font-bold text-text-primary mb-2">结算支付</h1>
              <nav className="text-sm text-text-secondary">
                <Link to="/home" className="hover:text-primary">首页</Link>
                <span className="mx-2">/</span>
                <Link to={`/product-detail?id=${productId}`} className="hover:text-primary">商品详情</Link>
                <span className="mx-2">/</span>
                <span className="text-text-primary">结算支付</span>
              </nav>
            </div>

            {/* 结算表单 */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 左侧：订单信息和支付方式 */}
                <div className="lg:col-span-2 space-y-6">
                  {/* 订单信息 */}
                  <div className="bg-white rounded-xl shadow-card p-6">
                    <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                      <i className="fas fa-shopping-bag text-primary mr-2"></i>
                      订单信息
                    </h2>
                    <div className="space-y-4">
                      {/* 商品信息 */}
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img 
                          src={currentProduct.image}
                          alt={currentProduct.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-text-primary mb-1">{currentProduct.name}</h3>
                          <p className="text-sm text-text-secondary">{currentProduct.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-semibold text-primary">¥{currentProduct.price.toLocaleString()}</span>
                          <p className="text-sm text-text-secondary">x1</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 接收信息 */}
                  <div className="bg-white rounded-xl shadow-card p-6">
                    <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                      <i className="fas fa-envelope text-primary mr-2"></i>
                      接收信息
                    </h2>
                    <div className="space-y-4">
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="receiver-type" 
                            value="email" 
                            checked={receiverType === 'email'}
                            onChange={() => handleReceiverTypeChange('email')}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-text-primary">邮箱接收</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="receiver-type" 
                            value="phone" 
                            checked={receiverType === 'phone'}
                            onChange={() => handleReceiverTypeChange('phone')}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-text-primary">手机接收</span>
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          {receiverType === 'email' ? '邮箱地址' : '手机号码'} <span className="text-danger">*</span>
                        </label>
                        <input 
                          type={receiverType}
                          value={receiverInfo}
                          onChange={handleReceiverInfoChange}
                          placeholder={receiverType === 'email' ? '请输入您的邮箱地址' : '请输入您的手机号码'}
                          className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInput}`}
                          required
                        />
                        <p className="text-xs text-text-secondary mt-1">
                          {receiverType === 'email' ? '虚拟商品的账号密码将发送到此邮箱' : '虚拟商品的账号密码将发送到此手机'}
                        </p>
                        {receiverError && (
                          <p className="text-xs text-danger mt-1">{receiverError}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 支付方式 */}
                  <div className="bg-white rounded-xl shadow-card p-6">
                    <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                      <i className="fas fa-credit-card text-primary mr-2"></i>
                      支付方式
                    </h2>
                    <div className="space-y-3">
                      <div 
                        className={`${styles.paymentOption} border-2 rounded-lg p-4 cursor-pointer ${
                          paymentMethod === 'wechat' ? styles.paymentOptionSelected : 'border-border-light'
                        }`}
                        onClick={() => handlePaymentMethodChange('wechat')}
                      >
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                              <i className="fab fa-weixin text-white text-xl"></i>
                            </div>
                            <div>
                              <p className="font-medium text-text-primary">微信支付</p>
                              <p className="text-sm text-text-secondary">安全便捷的移动支付</p>
                            </div>
                          </div>
                          <input 
                            type="radio" 
                            name="payment-method" 
                            value="wechat" 
                            checked={paymentMethod === 'wechat'}
                            onChange={() => handlePaymentMethodChange('wechat')}
                            className="text-primary focus:ring-primary"
                          />
                        </label>
                      </div>
                      
                      <div 
                        className={`${styles.paymentOption} border-2 rounded-lg p-4 cursor-pointer ${
                          paymentMethod === 'alipay' ? styles.paymentOptionSelected : 'border-border-light'
                        }`}
                        onClick={() => handlePaymentMethodChange('alipay')}
                      >
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-info rounded-lg flex items-center justify-center">
                              <i className="fab fa-alipay text-white text-xl"></i>
                            </div>
                            <div>
                              <p className="font-medium text-text-primary">支付宝</p>
                              <p className="text-sm text-text-secondary">支付宝安全支付</p>
                            </div>
                          </div>
                          <input 
                            type="radio" 
                            name="payment-method" 
                            value="alipay" 
                            checked={paymentMethod === 'alipay'}
                            onChange={() => handlePaymentMethodChange('alipay')}
                            className="text-primary focus:ring-primary"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右侧：订单汇总 */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-card p-6">
                    <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                      <i className="fas fa-calculator text-primary mr-2"></i>
                      订单汇总
                    </h2>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">商品金额</span>
                        <span className="text-text-primary">¥{currentProduct.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">运费</span>
                        <span className="text-success">免费</span>
                      </div>
                      <div className="border-t border-border-light pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-text-primary">实付金额</span>
                          <span className="text-xl font-bold text-primary">¥{currentProduct.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* 优惠信息 */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-gift text-warning"></i>
                        <span className="text-sm text-text-primary">新用户专享优惠已自动应用</span>
                      </div>
                    </div>

                    {/* 去支付按钮 */}
                    <button 
                      onClick={handlePayNow}
                      disabled={isPayButtonDisabled}
                      className={`w-full py-3 rounded-lg ${styles.btnPrimary} font-semibold text-lg`}
                    >
                      <i className="fas fa-lock mr-2"></i>
                      {isPayButtonDisabled ? '请先填写接收信息' : `立即支付 ¥${currentProduct.price.toLocaleString()}`}
                    </button>

                    {/* 安全提示 */}
                    <div className="mt-4 text-center">
                      <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
                        <i className="fas fa-shield-alt text-success"></i>
                        <span>安全支付保障</span>
                      </div>
                    </div>
                  </div>

                  {/* 温馨提示 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h3 className="font-medium text-text-primary mb-2 flex items-center">
                      <i className="fas fa-lightbulb text-warning mr-2"></i>
                      温馨提示
                    </h3>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• 支付完成后，商品信息将立即发送到您的邮箱</li>
                      <li>• 如有问题请联系客服：400-123-4567</li>
                      <li>• 支持7天无理由退款</li>
                      <li>• 虚拟商品购买后不支持退换</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 侧边栏遮罩（移动端） */}
      {isMobileSidebarVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeMobileSidebar}
        ></div>
      )}
    </div>
  );
};

export default CheckoutPage;

