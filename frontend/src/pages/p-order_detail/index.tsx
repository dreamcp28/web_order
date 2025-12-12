

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface OrderData {
  orderNumber: string;
  orderTime: string;
  paymentMethod: string;
  orderStatus: 'paid' | 'pending' | 'cancelled';
  totalAmount: string;
  product: {
    name: string;
    image: string;
    price: string;
    quantity: number;
  };
  receiver: {
    name: string;
    email: string;
    phone: string;
  };
  virtualAccount?: {
    systemUrl: string;
    username: string;
    password: string;
  };
}

const OrderDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarCollapsed, _setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('已复制到剪贴板');
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '订单详情 - 云商速构';
    return () => { document.title = originalTitle; };
  }, []);

  // 模拟订单数据
  const mockOrders: Record<string, OrderData> = {
    "order1": {
      orderNumber: "YS202401150001",
      orderTime: "2024-01-15 14:30:25",
      paymentMethod: "微信支付",
      orderStatus: "paid",
      totalAmount: "¥2,999",
      product: {
        name: "电商系统基础版 - 快速上线解决方案",
        image: "https://s.coze.cn/image/BvitJRJkhRY/",
        price: "¥2,999",
        quantity: 1
      },
      receiver: {
        name: "张三",
        email: "zhang***@example.com",
        phone: "138****5678"
      },
      virtualAccount: {
        systemUrl: "https://s.coze.cn/image/oAXNVjIlCb0/",
        username: "admin",
        password: "YunShang2024!"
      }
    },
    "order2": {
      orderNumber: "YS202401150002",
      orderTime: "2024-01-15 16:45:12",
      paymentMethod: "支付宝",
      orderStatus: "pending",
      totalAmount: "¥8,999",
      product: {
        name: "企业级电商平台 - 全功能定制版",
        image: "https://s.coze.cn/image/XrC6JkA-1Zw/",
        price: "¥8,999",
        quantity: 1
      },
      receiver: {
        name: "李四",
        email: "li***@example.com",
        phone: "139****9012"
      },
      virtualAccount: undefined
    }
  };

  // 加载订单数据
  useEffect(() => {
    const orderId = searchParams.get('orderId') || 'order1';
    const order = mockOrders[orderId] || mockOrders["order1"];
    setOrderData(order);
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

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/product-list?category=${categoryId}`);
  };

  const copyToClipboard = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(message);
    } catch {
      // 降级处理
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast(message);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setShowCopyToast(true);
    setTimeout(() => {
      setShowCopyToast(false);
    }, 2000);
  };

  const handleBackToOrders = () => {
    navigate(-1);
  };

  const handleContactService = () => {
    navigate('/chat-support');
  };

  const getOrderStatusDisplay = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          className: styles.statusBadgePaid,
          content: (
            <>
              <i className="fas fa-check-circle mr-1"></i>
              已支付
            </>
          )
        };
      case 'pending':
        return {
          className: styles.statusBadgePending,
          content: (
            <>
              <i className="fas fa-clock mr-1"></i>
              待支付
            </>
          )
        };
      case 'cancelled':
        return {
          className: styles.statusBadgeCancelled,
          content: (
            <>
              <i className="fas fa-times-circle mr-1"></i>
              已取消
            </>
          )
        };
      default:
        return {
          className: styles.statusBadgePaid,
          content: (
            <>
              <i className="fas fa-check-circle mr-1"></i>
              已支付
            </>
          )
        };
    }
  };

  if (!orderData) {
    return (
      <div className={styles.pageWrapper}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-text-secondary">加载中...</div>
        </div>
      </div>
    );
  }

  const statusDisplay = getOrderStatusDisplay(orderData.orderStatus);

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
                src="https://s.coze.cn/image/fcI1rX4UxbE/" 
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
                <Link 
                  to="/user-center"
                  className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}
                >
                  <i className="fas fa-receipt w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>我的订单</span>
                </Link>
                <button className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary w-full text-left`}>
                  <i className="fas fa-heart w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>收藏夹</span>
                </button>
                <Link 
                  to="/help-center"
                  className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}
                >
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
              <div className="flex items-center space-x-2 text-sm text-text-secondary mb-4">
                <Link to="/home" className="hover:text-primary">首页</Link>
                <i className="fas fa-chevron-right text-xs"></i>
                <Link to="/user-center" className="hover:text-primary">个人中心</Link>
                <i className="fas fa-chevron-right text-xs"></i>
                <Link to={`/order-confirm?orderId=${searchParams.get('orderId') || 'order1'}`} className="hover:text-primary">订单确认</Link>
                <i className="fas fa-chevron-right text-xs"></i>
                <span className="text-text-primary">订单详情</span>
              </div>
              <h1 className="text-2xl font-bold text-text-primary">订单详情</h1>
            </div>

            {/* 订单信息卡片 */}
            <div className="bg-white rounded-xl shadow-card p-6 mb-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <i className="fas fa-info-circle text-primary mr-2"></i>
                订单信息
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-text-secondary">订单号</label>
                  <p className="font-medium text-text-primary">{orderData.orderNumber}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-text-secondary">下单时间</label>
                  <p className="font-medium text-text-primary">{orderData.orderTime}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-text-secondary">支付方式</label>
                  <p className="font-medium text-text-primary">
                    {orderData.paymentMethod === '微信支付' ? (
                      <>
                        <i className="fab fa-weixin text-success mr-1"></i>
                        微信支付
                      </>
                    ) : (
                      <>
                        <i className="fab fa-alipay text-info mr-1"></i>
                        支付宝
                      </>
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-text-secondary">订单状态</label>
                  <span className={`${statusDisplay.className} px-3 py-1 rounded-full text-sm font-medium`}>
                    {statusDisplay.content}
                  </span>
                </div>
              </div>
            </div>

            {/* 商品信息卡片 */}
            <div className="bg-white rounded-xl shadow-card p-6 mb-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <i className="fas fa-box text-primary mr-2"></i>
                商品信息
              </h2>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex-shrink-0">
                  <img 
                    src={orderData.product.image}
                    alt={orderData.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-text-primary">{orderData.product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-primary">{orderData.product.price}</span>
                      <span className="text-sm text-text-secondary">x{orderData.product.quantity}</span>
                    </div>
                    <span className="text-lg font-bold text-text-primary">{orderData.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 收货信息卡片 */}
            <div className="bg-white rounded-xl shadow-card p-6 mb-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <i className="fas fa-envelope text-primary mr-2"></i>
                收货信息
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-user text-text-secondary"></i>
                  <span className="font-medium text-text-primary">{orderData.receiver.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-envelope text-text-secondary"></i>
                  <span className="font-medium text-text-primary">{orderData.receiver.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-phone text-text-secondary"></i>
                  <span className="font-medium text-text-primary">{orderData.receiver.phone}</span>
                </div>
              </div>
            </div>

            {/* 虚拟商品详情卡片（仅在已支付状态显示） */}
            {orderData.orderStatus === 'paid' && orderData.virtualAccount && (
              <div className="bg-white rounded-xl shadow-card p-6 mb-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                  <i className="fas fa-key text-primary mr-2"></i>
                  商品账号信息
                  <span className="ml-2 text-sm text-text-secondary font-normal">（请妥善保管，切勿泄露）</span>
                </h2>
                <div className="space-y-4">
                  <div className="bg-bg-light rounded-lg p-4">
                    <h3 className="font-medium text-text-primary mb-3">系统访问账号</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-text-secondary">系统地址</label>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm text-text-primary">{orderData.virtualAccount.systemUrl}</span>
                          <button 
                            onClick={() => copyToClipboard(orderData.virtualAccount!.systemUrl, '系统地址已复制')}
                            className={`${styles.copyButton} p-1 rounded hover:bg-blue-100 transition-colors`} 
                            title="复制"
                          >
                            <i className="fas fa-copy text-xs text-primary"></i>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-text-secondary">管理员账号</label>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm text-text-primary">{orderData.virtualAccount.username}</span>
                          <button 
                            onClick={() => copyToClipboard(orderData.virtualAccount!.username, '管理员账号已复制')}
                            className={`${styles.copyButton} p-1 rounded hover:bg-blue-100 transition-colors`} 
                            title="复制"
                          >
                            <i className="fas fa-copy text-xs text-primary"></i>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-text-secondary">管理员密码</label>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm text-text-primary">{orderData.virtualAccount.password}</span>
                          <button 
                            onClick={() => copyToClipboard(orderData.virtualAccount!.password, '管理员密码已复制')}
                            className={`${styles.copyButton} p-1 rounded hover:bg-blue-100 transition-colors`} 
                            title="复制"
                          >
                            <i className="fas fa-copy text-xs text-primary"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-primary mb-3 flex items-center">
                      <i className="fas fa-lightbulb mr-2"></i>
                      使用提示
                    </h3>
                    <ul className="space-y-2 text-sm text-text-primary">
                      <li className="flex items-start">
                        <i className="fas fa-check text-success text-xs mt-1.5 mr-2"></i>
                        <span>登录后请及时修改管理员密码，确保账户安全</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check text-success text-xs mt-1.5 mr-2"></i>
                        <span>系统支持自定义域名，可在设置中进行配置</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check text-success text-xs mt-1.5 mr-2"></i>
                        <span>如有技术问题，请联系客服获取帮助</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check text-success text-xs mt-1.5 mr-2"></i>
                        <span>系统提供7天无理由退款服务</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 操作按钮区域 */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={handleBackToOrders}
                className="flex-1 bg-white border border-border-light text-text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                返回订单列表
              </button>
              <button 
                onClick={handleContactService}
                className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                <i className="fas fa-headset mr-2"></i>
                联系客服
              </button>
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

      {/* 复制成功提示 */}
      <div className={`fixed top-20 right-4 bg-success text-white px-4 py-2 rounded-lg shadow-lg transform transition-transform duration-300 z-50 ${
        showCopyToast ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <i className="fas fa-check mr-2"></i>
        {toastMessage}
      </div>
    </div>
  );
};

export default OrderDetailPage;

