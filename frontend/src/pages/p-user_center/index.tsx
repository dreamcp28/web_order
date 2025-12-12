

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'paid' | 'cancelled';
  productImage: string;
  productName: string;
  productPrice: string;
  total: string;
}

const UserCenter: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, _setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [activeOrderTab, setActiveOrderTab] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [userNickname, setUserNickname] = useState('张三');
  const [editNickname, setEditNickname] = useState('张三');

  const orderItems: OrderItem[] = [
    {
      id: 'ORD202401150001',
      orderNumber: 'ORD202401150001',
      date: '2024-01-15 14:30',
      status: 'paid',
      productImage: 'https://s.coze.cn/image/Dej9mqXpwqs/',
      productName: '电商系统基础版 - 快速上线解决方案',
      productPrice: '¥2,999',
      total: '¥2,999'
    },
    {
      id: 'ORD202401120002',
      orderNumber: 'ORD202401120002',
      date: '2024-01-12 10:15',
      status: 'pending',
      productImage: 'https://s.coze.cn/image/eObPdQAO3hE/',
      productName: '企业级电商平台 - 全功能定制版',
      productPrice: '¥8,999',
      total: '¥8,999'
    },
    {
      id: 'ORD202401100003',
      orderNumber: 'ORD202401100003',
      date: '2024-01-10 16:45',
      status: 'cancelled',
      productImage: 'https://s.coze.cn/image/j4DHFCzyWOI/',
      productName: '智能客服系统 - 7x24小时在线服务',
      productPrice: '¥1,599',
      total: '¥1,599'
    },
    {
      id: 'ORD202401080004',
      orderNumber: 'ORD202401080004',
      date: '2024-01-08 09:20',
      status: 'paid',
      productImage: 'https://s.coze.cn/image/7fVCW84GWIE/',
      productName: 'DevOps自动化部署 - 一键上线运维',
      productPrice: '¥3,999',
      total: '¥3,999'
    }
  ];

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '个人中心 - 云商速构';
    return () => { document.title = originalTitle; };
  }, []);

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
      const keyword = searchKeyword.trim();
      if (keyword) {
        navigate(`/product-list?search=${encodeURIComponent(keyword)}`);
      }
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/product-list?category=${categoryId}`);
  };

  const handleQuickHelpClick = () => {
    navigate('/help-center');
  };

  const handleEditProfileClick = () => {
    setEditNickname(userNickname);
    setIsEditModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsEditModalVisible(false);
  };

  // 移除未使用的函数
  // const _handleModalBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (e.target === e.currentTarget) {
  //     setIsEditModalVisible(false);
  //   }
  // };


  const handleEditProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nickname = editNickname.trim();
    
    if (nickname) {
      setUserNickname(nickname);
      setIsEditModalVisible(false);
      alert('资料修改成功！');
    }
  };

  const handleOrderTabClick = (tabStatus: string) => {
    setActiveOrderTab(tabStatus);
  };

  const handleOrderItemClick = (orderId: string) => {
    navigate(`/order-detail?orderId=${orderId}`);
  };

  const handleOrderDetailClick = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    navigate(`/order-detail?orderId=${orderId}`);
  };

  const handleStartChatClick = () => {
    navigate('/chat-support');
  };

  const handleLoadMoreOrders = () => {
    console.log('加载更多订单');
    alert('暂无更多订单');
  };

  const handleAvatarEditClick = () => {
    console.log('需要调用第三方接口实现头像上传功能');
    alert('头像上传功能即将上线');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.statusBadgePending;
      case 'paid':
        return styles.statusBadgePaid;
      case 'cancelled':
        return styles.statusBadgeCancelled;
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待支付';
      case 'paid':
        return '已支付';
      case 'cancelled':
        return '已取消';
      default:
        return '';
    }
  };

  const filteredOrders = activeOrderTab === 'all' 
    ? orderItems 
    : orderItems.filter(item => item.status === activeOrderTab);

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
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
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
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
              <img 
                src="https://s.coze.cn/image/UNaJ4o7cgdQ/" 
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
          isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded
        } ${!isSidebarVisible && !isSidebarCollapsed ? '-translate-x-full' : ''}`}>
          <div className="h-full overflow-y-auto">
            {/* 商品分类 */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">商品分类</h3>
              <nav className="space-y-1">
                <button 
                  onClick={() => handleCategoryClick('all')}
                  className={`${styles.categoryItem} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary w-full text-left`}
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
                <button className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-primary bg-blue-50 w-full text-left`}>
                  <i className="fas fa-receipt w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>我的订单</span>
                </button>
                <button className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary w-full text-left`}>
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
                <li className="text-text-primary">个人中心</li>
              </ol>
            </nav>

            {/* 页面标题 */}
            <h1 className="text-3xl font-bold text-text-primary mb-8">个人中心</h1>

            {/* 个人信息卡片 */}
            <section className="bg-white rounded-xl shadow-card p-6 mb-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img 
                    src="https://s.coze.cn/image/Kp5MCLIoKBM/" 
                    alt="用户头像" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <button 
                    onClick={handleAvatarEditClick}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-600"
                  >
                    <i className="fas fa-camera"></i>
                  </button>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-text-primary mb-2">{userNickname}</h2>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-text-secondary">138****8888</span>
                    <span className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm">高级用户</span>
                  </div>
                  <button 
                    onClick={handleEditProfileClick}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    编辑资料
                  </button>
                </div>
              </div>
            </section>

            {/* 我的订单 */}
            <section className="bg-white rounded-xl shadow-card mb-8">
              <div className="p-6 border-b border-border-light">
                <h2 className="text-xl font-semibold text-text-primary">我的订单</h2>
              </div>
              
              {/* 订单状态筛选 */}
              <div className="p-6 border-b border-border-light">
                <div className="flex space-x-4" role="tablist">
                  <button 
                    onClick={() => handleOrderTabClick('all')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none ${
                      activeOrderTab === 'all' ? styles.tabActive : styles.tabInactive
                    }`}
                    role="tab"
                  >
                    全部订单
                  </button>
                  <button 
                    onClick={() => handleOrderTabClick('pending')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none ${
                      activeOrderTab === 'pending' ? styles.tabActive : styles.tabInactive
                    }`}
                    role="tab"
                  >
                    待支付
                  </button>
                  <button 
                    onClick={() => handleOrderTabClick('paid')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none ${
                      activeOrderTab === 'paid' ? styles.tabActive : styles.tabInactive
                    }`}
                    role="tab"
                  >
                    已支付
                  </button>
                  <button 
                    onClick={() => handleOrderTabClick('cancelled')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none ${
                      activeOrderTab === 'cancelled' ? styles.tabActive : styles.tabInactive
                    }`}
                    role="tab"
                  >
                    已取消
                  </button>
                </div>
              </div>
              
              {/* 订单列表 */}
              <div className="divide-y divide-border-light">
                {filteredOrders.map((order) => (
                  <div 
                    key={order.id}
                    onClick={() => handleOrderItemClick(order.id)}
                    className={`${styles.orderItem} p-6 cursor-pointer`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-text-secondary">订单号：{order.orderNumber}</span>
                        <span className="text-sm text-text-secondary">{order.date}</span>
                      </div>
                      <span className={`${getStatusBadgeClass(order.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={order.productImage}
                          alt={order.productName}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-text-primary">{order.productName}</h3>
                          <p className="text-sm text-text-secondary">单价：{order.productPrice}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-text-primary">{order.total}</p>
                        <button 
                          onClick={(e) => handleOrderDetailClick(e, order.id)}
                          className="mt-2 text-primary text-sm hover:text-blue-600"
                        >
                          查看详情
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 加载更多 */}
              <div className="p-6 text-center">
                <button 
                  onClick={handleLoadMoreOrders}
                  className="text-primary text-sm hover:text-blue-600"
                >
                  <i className="fas fa-chevron-down mr-1"></i>
                  加载更多订单
                </button>
              </div>
            </section>

            {/* 智能客服入口（仅高级用户可见） */}
            <section className="bg-gradient-to-r from-primary to-secondary rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">智能客服支持</h3>
                  <p className="text-white opacity-90 text-sm">7x24小时在线服务，专业技术支持</p>
                </div>
                <button 
                  onClick={handleStartChatClick}
                  className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <i className="fas fa-comments mr-2"></i>
                  开始咨询
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* 侧边栏遮罩（移动端） */}
      <div 
        onClick={handleSidebarOverlayClick}
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden ${isSidebarVisible ? '' : 'hidden'}`}
      ></div>

      {/* 编辑资料模态框 */}
      {isEditModalVisible && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalBackdrop}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`bg-white rounded-xl shadow-xl max-w-md w-full ${styles.modalEnter}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">编辑资料</h3>
                  <button 
                    onClick={handleCloseModal}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <form onSubmit={handleEditProfileSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="edit-nickname" className="block text-sm font-medium text-text-primary mb-2">昵称</label>
                    <input 
                      type="text" 
                      id="edit-nickname" 
                      name="nickname" 
                      value={editNickname}
                      onChange={(e) => setEditNickname(e.target.value)}
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-phone" className="block text-sm font-medium text-text-primary mb-2">手机号</label>
                    <input 
                      type="tel" 
                      id="edit-phone" 
                      name="phone" 
                      value="13888888888" 
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      readOnly
                    />
                    <p className="text-xs text-text-secondary mt-1">手机号不可修改</p>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:bg-gray-50 transition-colors"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      保存
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCenter;

