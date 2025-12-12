

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { useAuth } from '../../contexts/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const [isSidebarCollapsed, _setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isServicePanelOpen, setIsServicePanelOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '云商速构 - 一站式电商系统构建平台';
    return () => { document.title = originalTitle; };
  }, []);

  // 移除未使用的侧边栏切换函数
  // const _handleSidebarToggle = () => {
  //   setIsSidebarCollapsed(!isSidebarCollapsed);
  // };

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const keyword = searchKeyword.trim();
      if (keyword) {
        navigate(`/product-list?search=${encodeURIComponent(keyword)}`);
      }
    }
  };

  const handleProductCardClick = (productId: string) => {
    navigate(`/product-detail?id=${productId}`);
  };

  const handleBuyButtonClick = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    navigate(`/checkout?product=${productId}`);
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/product-list?category=${categoryId}`);
  };

  const handleQuickOrdersClick = () => {
    navigate('/user-center');
  };

  const handleQuickHelpClick = () => {
    navigate('/help-center');
  };

  // 移除未使用的用户菜单点击函数
  // const _handleUserMenuClick = () => {
  //   navigate('/user-center');
  // };

  const handleStartBuildingClick = () => {
    navigate('/product-list');
  };

  const handleViewDemoClick = () => {
    alert('演示功能即将上线');
  };

  const handleHotProductsMoreClick = () => {
    navigate('/product-list?sort=hot');
  };

  const handleNewProductsMoreClick = () => {
    navigate('/product-list?sort=new');
  };

  const handleServiceToggleClick = () => {
    setIsServicePanelOpen(!isServicePanelOpen);
  };

  const handleServiceConsultClick = () => {
    navigate('/chat-support?type=consult');
  };

  const handleServiceOrderClick = () => {
    navigate('/chat-support?type=order');
  };

  const handleServiceTechClick = () => {
    navigate('/chat-support?type=tech');
  };

  const handleServiceFeedbackClick = () => {
    navigate('/chat-support?type=feedback');
  };

  const handleDocumentClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const serviceElement = document.getElementById('floating-customer-service');
    if (serviceElement && !serviceElement.contains(target)) {
      setIsServicePanelOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setIsMobileSidebarOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* 左侧：Logo和菜单切换 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleMobileSidebarToggle}
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
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="搜索商品..." 
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
            {/* 用户菜单 */}
            <div className="relative">
              {isLoggedIn ? (
                <div 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
                >
                  <img 
                    src={user?.avatar || "https://s.coze.cn/image/sr1IvmB11Qk/"} 
                    alt="用户头像" 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-text-primary hidden md:block">{user?.username || '用户'}</span>
                  <i className="fas fa-chevron-down text-xs text-text-secondary hidden md:block"></i>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="text-sm text-text-primary hover:text-primary">登录</Link>
                  <span className="text-text-secondary">|</span>
                  <Link to="/register" className="text-sm text-primary hover:underline">注册</Link>
                </div>
              )}
              
              {/* 下拉菜单 */}
              {isLoggedIn && isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border-light rounded-lg shadow-lg z-50">
                  <Link to="/user-center" className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-50">个人中心</Link>
                  <Link to="/order-manage" className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-50">我的订单</Link>
                  <Link to="/security-settings" className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-50">账户设置</Link>
                  <div className="border-t border-border-light my-1"></div>
                  <button 
                    onClick={logout} 
                    className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-50"
                  >
                    退出登录
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 主容器 */}
      <div className="flex pt-16">
        {/* 左侧菜单 */}
        <aside className={`fixed left-0 top-16 bottom-0 bg-white border-r border-border-light transition-all duration-300 z-40 lg:relative lg:top-0 ${
          isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded
        } ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="h-full overflow-y-auto">
            {/* 商品分类 */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">商品分类</h3>
              <nav className="space-y-1">
                <button 
                  onClick={() => handleCategoryClick('all')}
                  className={`${styles.categoryItem} ${styles.categoryItemActive} flex items-center px-3 py-2 rounded-lg text-sm w-full text-left`}
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
            {/* 欢迎横幅 */}
            <section className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 mb-8 text-white">
              <div className="max-w-4xl">
                <h1 className="text-3xl font-bold mb-4">欢迎使用云商速构</h1>
                <p className="text-lg opacity-90 mb-6">3-5天快速构建您的专属电商系统，一站式解决方案让创业更简单</p>
                <div className="flex space-x-4">
                  <button 
                    onClick={handleStartBuildingClick}
                    className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    <i className="fas fa-rocket mr-2"></i>
                    开始构建
                  </button>
                  <button 
                    onClick={handleViewDemoClick}
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
                  >
                    <i className="fas fa-play mr-2"></i>
                    查看演示
                  </button>
                </div>
              </div>
            </section>

            {/* 热门商品 */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary">热门商品</h2>
                <button 
                  onClick={handleHotProductsMoreClick}
                  className="text-primary hover:text-blue-700 font-medium"
                >
                  查看更多 <i className="fas fa-arrow-right ml-1"></i>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* 商品卡片1 */}
                <div 
                  onClick={() => handleProductCardClick('prod001')}
                  className={`${styles.productCard} bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer`}
                >
                  <div className="relative">
                    <img 
                      src="https://s.coze.cn/image/D1waKLHIgkU/" 
                      alt="电商系统基础版" 
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-danger text-white text-xs px-2 py-1 rounded-full">热销</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">电商系统基础版 - 快速上线解决方案</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">¥2,999</span>
                      <button 
                        onClick={(e) => handleBuyButtonClick(e, 'prod001')}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        立即购买
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm text-text-secondary">
                      <span><i className="fas fa-star text-yellow-400 mr-1"></i>4.9 (128)</span>
                      <span>已售 356</span>
                    </div>
                  </div>
                </div>

                {/* 商品卡片2 */}
                <div 
                  onClick={() => handleProductCardClick('prod002')}
                  className={`${styles.productCard} bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer`}
                >
                  <div className="relative">
                    <img 
                      src="https://s.coze.cn/image/-bTdsod-Cos/" 
                      alt="企业级电商平台" 
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-warning text-white text-xs px-2 py-1 rounded-full">推荐</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">企业级电商平台 - 全功能定制版</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">¥8,999</span>
                      <button 
                        onClick={(e) => handleBuyButtonClick(e, 'prod002')}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        立即购买
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm text-text-secondary">
                      <span><i className="fas fa-star text-yellow-400 mr-1"></i>4.8 (89)</span>
                      <span>已售 124</span>
                    </div>
                  </div>
                </div>

                {/* 商品卡片3 */}
                <div 
                  onClick={() => handleProductCardClick('prod003')}
                  className={`${styles.productCard} bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer`}
                >
                  <div className="relative">
                    <img 
                      src="https://s.coze.cn/image/ptTjcxaSddw/" 
                      alt="智能客服系统" 
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-success text-white text-xs px-2 py-1 rounded-full">新品</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">智能客服系统 - 7x24小时在线服务</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">¥1,599</span>
                      <button 
                        onClick={(e) => handleBuyButtonClick(e, 'prod003')}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        立即购买
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm text-text-secondary">
                      <span><i className="fas fa-star text-yellow-400 mr-1"></i>4.7 (67)</span>
                      <span>已售 89</span>
                    </div>
                  </div>
                </div>

                {/* 商品卡片4 */}
                <div 
                  onClick={() => handleProductCardClick('prod004')}
                  className={`${styles.productCard} bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer`}
                >
                  <div className="relative">
                    <img 
                      src="https://s.coze.cn/image/h2_KS0fc5vk/" 
                      alt="DevOps自动化部署" 
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">DevOps自动化部署 - 一键上线运维</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">¥3,999</span>
                      <button 
                        onClick={(e) => handleBuyButtonClick(e, 'prod004')}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        立即购买
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm text-text-secondary">
                      <span><i className="fas fa-star text-yellow-400 mr-1"></i>4.9 (156)</span>
                      <span>已售 234</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 新品推荐 */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary">新品推荐</h2>
                <button 
                  onClick={handleNewProductsMoreClick}
                  className="text-primary hover:text-blue-700 font-medium"
                >
                  查看更多 <i className="fas fa-arrow-right ml-1"></i>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* 新品卡片1 */}
                <div 
                  onClick={() => handleProductCardClick('prod005')}
                  className={`${styles.productCard} bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer`}
                >
                  <div className="relative">
                    <img 
                      src="https://s.coze.cn/image/MEMZsoxT8mY/" 
                      alt="移动端商城" 
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-info text-white text-xs px-2 py-1 rounded-full">新品</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">移动端商城 - 小程序+H5全端覆盖</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">¥4,599</span>
                      <button 
                        onClick={(e) => handleBuyButtonClick(e, 'prod005')}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        立即购买
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm text-text-secondary">
                      <span><i className="fas fa-star text-yellow-400 mr-1"></i>4.6 (23)</span>
                      <span>已售 45</span>
                    </div>
                  </div>
                </div>

                {/* 新品卡片2 */}
                <div 
                  onClick={() => handleProductCardClick('prod006')}
                  className={`${styles.productCard} bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer`}
                >
                  <div className="relative">
                    <img 
                      src="https://s.coze.cn/image/f3RUpNZPiaU/" 
                      alt="数据分析平台" 
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-info text-white text-xs px-2 py-1 rounded-full">新品</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">数据分析平台 - 商业智能决策</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">¥6,999</span>
                      <button 
                        onClick={(e) => handleBuyButtonClick(e, 'prod006')}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        立即购买
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm text-text-secondary">
                      <span><i className="fas fa-star text-yellow-400 mr-1"></i>4.8 (15)</span>
                      <span>已售 28</span>
                    </div>
                  </div>
                </div>

                {/* 新品卡片3 */}
                <div 
                  onClick={() => handleProductCardClick('prod007')}
                  className={`${styles.productCard} bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer`}
                >
                  <div className="relative">
                    <img 
                      src="https://s.coze.cn/image/OHAh9Yt3iqY/" 
                      alt="多语言商城" 
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-info text-white text-xs px-2 py-1 rounded-full">新品</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">多语言商城 - 全球化业务拓展</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">¥5,299</span>
                      <button 
                        onClick={(e) => handleBuyButtonClick(e, 'prod007')}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        立即购买
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm text-text-secondary">
                      <span><i className="fas fa-star text-yellow-400 mr-1"></i>4.7 (19)</span>
                      <span>已售 32</span>
                    </div>
                  </div>
                </div>

                {/* 新品卡片4 */}
                <div 
                  onClick={() => handleProductCardClick('prod008')}
                  className={`${styles.productCard} bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer`}
                >
                  <div className="relative">
                    <img 
                      src="https://s.coze.cn/image/MNR4UUtVDgQ/" 
                      alt="AI智能推荐" 
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-info text-white text-xs px-2 py-1 rounded-full">新品</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">AI智能推荐 - 个性化购物体验</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">¥2,299</span>
                      <button 
                        onClick={(e) => handleBuyButtonClick(e, 'prod008')}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        立即购买
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm text-text-secondary">
                      <span><i className="fas fa-star text-yellow-400 mr-1"></i>4.5 (12)</span>
                      <span>已售 18</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 服务优势 */}
            <section className="bg-white rounded-2xl shadow-card p-8 mb-8">
              <h2 className="text-2xl font-bold text-text-primary text-center mb-8">为什么选择云商速构</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-bolt text-primary text-2xl"></i>
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">快速部署</h3>
                  <p className="text-text-secondary text-sm">3-5天完成系统构建与上线</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-shield-alt text-success text-2xl"></i>
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">安全可靠</h3>
                  <p className="text-text-secondary text-sm">多重安全防护，数据加密存储</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-warning bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-cogs text-warning text-2xl"></i>
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">全栈集成</h3>
                  <p className="text-text-secondary text-sm">一站式电商核心功能集成</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-info bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-headset text-info text-2xl"></i>
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">专业支持</h3>
                  <p className="text-text-secondary text-sm">7x24小时技术支持服务</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* 侧边栏遮罩（移动端） */}
      <div 
        onClick={handleMobileSidebarClose}
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden ${isMobileSidebarOpen ? '' : 'hidden'}`}
      ></div>
      
      {/* 悬浮智能客服 */}
      <div id="floating-customer-service" className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={handleServiceToggleClick}
          className="w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
        >
          <i className="fas fa-comments text-xl"></i>
        </button>
        <div className={`${isServicePanelOpen ? '' : 'hidden'} absolute bottom-16 right-0 w-64 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform origin-bottom-right`}>
          <div className="bg-primary text-white p-4">
            <h3 className="font-semibold">智能客服</h3>
            <p className="text-xs opacity-90">工作日 9:00-18:00</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-text-secondary mb-4">有什么可以帮助您的吗？</p>
            <div className="space-y-2">
              <button 
                onClick={handleServiceConsultClick}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
              >
                <i className="fas fa-question-circle text-primary mr-2"></i>产品咨询
              </button>
              <button 
                onClick={handleServiceOrderClick}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
              >
                <i className="fas fa-shopping-cart text-primary mr-2"></i>订单问题
              </button>
              <button 
                onClick={handleServiceTechClick}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
              >
                <i className="fas fa-cog text-primary mr-2"></i>技术支持
              </button>
              <button 
                onClick={handleServiceFeedbackClick}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
              >
                <i className="fas fa-envelope text-primary mr-2"></i>留言反馈
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

