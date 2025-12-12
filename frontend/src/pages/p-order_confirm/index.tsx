

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface OrderData {
  orderNumber: string;
  amount: string;
  paymentMethod: string;
  paymentTime: string;
  status: 'success' | 'failed';
}

const OrderConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarCollapsed, _setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '订单确认 - 云商速构';
    return () => { document.title = originalTitle; };
  }, []);

  // 模拟订单数据
  const mockOrders: Record<string, OrderData> = {
    "order1": {
      orderNumber: "YS202401150001",
      amount: "¥2,999.00",
      paymentMethod: "微信支付",
      paymentTime: "2024-01-15 14:30:25",
      status: "success"
    },
    "order2": {
      orderNumber: "YS202401150002", 
      amount: "¥8,999.00",
      paymentMethod: "支付宝",
      paymentTime: "2024-01-15 15:15:42",
      status: "success"
    },
    "order3": {
      orderNumber: "YS202401150003",
      amount: "¥1,599.00",
      paymentMethod: "微信支付",
      paymentTime: "",
      status: "failed"
    }
  };

  // 加载订单数据
  useEffect(() => {
    const orderId = searchParams.get('orderId');
    let currentOrderData: OrderData;
    
    if (orderId && mockOrders[orderId]) {
      currentOrderData = mockOrders[orderId];
    } else {
      currentOrderData = mockOrders["order1"];
    }
    
    setOrderData(currentOrderData);
  }, [searchParams]);

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleSidebarOverlayClick = () => {
    setIsSidebarVisible(false);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const keyword = (e.target as HTMLInputElement).value.trim();
      if (keyword) {
        navigate(`/product-list?search=${encodeURIComponent(keyword)}`);
      }
    }
  };

  const handleViewOrderDetail = () => {
    const orderId = searchParams.get('orderId') || 'order1';
    navigate(`/order-detail?orderId=${orderId}`);
  };

  const handleContinueShopping = () => {
    navigate('/home');
  };

  const handleRetryPayment = () => {
    const orderId = searchParams.get('orderId') || 'order1';
    navigate(`/checkout?orderId=${orderId}`);
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/product-list?category=${categoryId}`);
  };

  const handleQuickOrdersClick = () => {
    navigate('/user-center');
  };

  const handleQuickHelpClick = () => {
    navigate('/chat-support');
  };

  const handleUserMenuClick = () => {
    navigate('/user-center');
  };

  if (!orderData) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* 左侧：Logo和菜单切换 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSidebarToggle}
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
                onKeyPress={handleSearchKeyPress}
                className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchInput}`}
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
            <div 
              onClick={handleUserMenuClick}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
            >
              <img 
                src="https://s.coze.cn/image/Kv1US6Hil2A/" 
                alt="用户头像" 
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-text-primary hidden md:block">张三</span>
              <i className="fas fa-chevron-down text-xs text-text-secondary hidden md:block"></i>
            </div>
          </div>
        </div>
      </header>

      {/* 主容器 */}
      <div className="flex pt-16">
        {/* 左侧菜单 */}
        <aside className={`fixed left-0 top-16 bottom-0 bg-white border-r border-border-light transition-all duration-300 z-40 lg:relative lg:top-0 ${
          isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        } ${isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded}`}>
          <div className="h-full overflow-y-auto">
            {/* 商品分类 */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">商品分类</h3>
              <nav className="space-y-1">
                <button 
                  onClick={() => handleCategoryClick('all')}
                  className={`${styles.categoryItem} flex items-center px-3 py-2 rounded-lg text-sm text-primary bg-blue-50 w-full text-left`}
                >
                  <i className="fas fa-th-large w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>全部商品</span>
                </button>
                <button 
                  onClick={() => handleCategoryClick('virtual')}
                  className={`${styles.categoryItem} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary w-full text-left`}
                >
                  <i className="fas fa-key w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>虚拟商品</span>
                </button>
                <button 
                  onClick={() => handleCategoryClick('software')}
                  className={`${styles.categoryItem} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary w-full text-left`}
                >
                  <i className="fas fa-laptop-code w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>软件工具</span>
                </button>
                <button 
                  onClick={() => handleCategoryClick('service')}
                  className={`${styles.categoryItem} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary w-full text-left`}
                >
                  <i className="fas fa-handshake w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>技术服务</span>
                </button>
                <button 
                  onClick={() => handleCategoryClick('template')}
                  className={`${styles.categoryItem} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary w-full text-left`}
                >
                  <i className="fas fa-layer-group w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>网站模板</span>
                </button>
              </nav>
            </div>
            
            {/* 快捷入口 */}
            <div className="p-4 border-t border-border-light">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">快捷入口</h3>
              <nav className="space-y-1">
                <button 
                  onClick={handleQuickOrdersClick}
                  className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary w-full text-left`}
                >
                  <i className="fas fa-receipt w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>我的订单</span>
                </button>
                <button 
                  onClick={() => {}}
                  className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary w-full text-left`}
                >
                  <i className="fas fa-heart w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>收藏夹</span>
                </button>
                <button 
                  onClick={handleQuickHelpClick}
                  className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary w-full text-left`}
                >
                  <i className="fas fa-question-circle w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>帮助中心</span>
                </button>
              </nav>
            </div>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="p-6">
            {/* 面包屑导航 */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-text-secondary">
                <li>
                  <Link to="/home" className="hover:text-primary">首页</Link>
                </li>
                <li>
                  <i className="fas fa-chevron-right text-xs"></i>
                </li>
                <li>
                  <Link 
                    to={`/checkout${searchParams.get('orderId') ? `?orderId=${searchParams.get('orderId')}` : ''}`}
                    className="hover:text-primary"
                  >
                    结算支付
                  </Link>
                </li>
                <li>
                  <i className="fas fa-chevron-right text-xs"></i>
                </li>
                <li className="text-text-primary">订单确认</li>
              </ol>
            </nav>

            {/* 页面标题 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                {orderData.status === 'success' ? '订单确认' : '支付失败'}
              </h1>
              <p className="text-text-secondary">
                {orderData.status === 'success' ? '请确认您的订单支付结果' : '请重新尝试支付'}
              </p>
            </div>

            {/* 支付结果展示区域 */}
            <div className="max-w-2xl mx-auto">
              {/* 支付成功结果 */}
              {orderData.status === 'success' && (
                <div className={`bg-white rounded-2xl shadow-card p-8 text-center ${styles.successAnimation}`}>
                  <div className="w-24 h-24 bg-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-check text-success text-4xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary mb-4">支付成功！</h2>
                  <p className="text-text-secondary mb-6">您的订单已支付成功，我们将尽快为您处理</p>
                  
                  {/* 订单信息 */}
                  <div className="bg-bg-light rounded-xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-text-secondary mb-2">订单号</h3>
                        <p className="text-lg font-semibold text-text-primary">{orderData.orderNumber}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-text-secondary mb-2">支付金额</h3>
                        <p className="text-lg font-semibold text-primary">{orderData.amount}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-text-secondary mb-2">支付方式</h3>
                        <p className="text-lg font-semibold text-text-primary">{orderData.paymentMethod}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-text-secondary mb-2">支付时间</h3>
                        <p className="text-lg font-semibold text-text-primary">{orderData.paymentTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={handleViewOrderDetail}
                      className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      查看订单详情
                    </button>
                    <button 
                      onClick={handleContinueShopping}
                      className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                    >
                      <i className="fas fa-shopping-bag mr-2"></i>
                      继续购物
                    </button>
                  </div>
                </div>
              )}

              {/* 支付失败结果 */}
              {orderData.status === 'failed' && (
                <div className={`bg-white rounded-2xl shadow-card p-8 text-center ${styles.failAnimation}`}>
                  <div className="w-24 h-24 bg-danger bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-times text-danger text-4xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary mb-4">支付失败</h2>
                  <p className="text-text-secondary mb-6">很抱歉，您的支付未能成功完成，请重试</p>
                  
                  {/* 失败原因 */}
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
                    <div className="flex items-center">
                      <i className="fas fa-exclamation-triangle text-danger mr-3"></i>
                      <span className="text-danger font-medium">支付超时，请重新发起支付</span>
                    </div>
                  </div>

                  {/* 失败操作按钮 */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={handleRetryPayment}
                      className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                      <i className="fas fa-redo mr-2"></i>
                      重新支付
                    </button>
                    <button 
                      onClick={handleBackToHome}
                      className="border-2 border-gray-300 text-text-secondary px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      <i className="fas fa-home mr-2"></i>
                      返回首页
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 温馨提示 */}
            <div className="max-w-2xl mx-auto mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">
                <i className="fas fa-lightbulb mr-2"></i>
                温馨提示
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-success mt-1 mr-2 text-xs"></i>
                  <span>您的商品信息已发送至您填写的邮箱/手机号，请查收</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-success mt-1 mr-2 text-xs"></i>
                  <span>如有任何问题，请联系我们的客服团队</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-success mt-1 mr-2 text-xs"></i>
                  <span>您可以在"个人中心-我的订单"中查看订单状态</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>

      {/* 侧边栏遮罩（移动端） */}
      {isSidebarVisible && (
        <div 
          onClick={handleSidebarOverlayClick}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        ></div>
      )}
    </div>
  );
};

export default OrderConfirmPage;

