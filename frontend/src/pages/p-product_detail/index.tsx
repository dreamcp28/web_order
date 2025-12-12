

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface ProductData {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  stock: number;
  badge: string;
  badgeClass: string;
  images: string[];
  category: string;
}

const ProductDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // 状态管理
    const [isSidebarCollapsed, _setIsSidebarCollapsed] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('基础版');
  const [selectedDuration, setSelectedDuration] = useState('1年');
  const [productQuantity, setProductQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isServicePanelVisible, setIsServicePanelVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductData | null>(null);

  // 模拟商品数据
  const mockProducts: Record<string, ProductData> = {
    '1': {
      id: '1',
      name: '电商系统基础版 - 快速上线解决方案',
      price: '¥2,999',
      originalPrice: '¥3,999',
      rating: 4.9,
      reviewCount: 128,
      salesCount: 356,
      stock: 999,
      badge: '热销',
      badgeClass: 'bg-danger',
      images: [
        'https://s.coze.cn/image/Ga0TWS7fZVo/',
        'https://s.coze.cn/image/-RdOM-OyBrQ/',
        'https://s.coze.cn/image/UQyWkbpwJqM/'
      ],
      category: '虚拟商品'
    },
    '2': {
      id: '2',
      name: '企业级电商平台 - 全功能定制版',
      price: '¥8,999',
      originalPrice: '¥12,999',
      rating: 4.8,
      reviewCount: 89,
      salesCount: 124,
      stock: 50,
      badge: '推荐',
      badgeClass: 'bg-warning',
      images: [
        'https://s.coze.cn/image/Rj44HgQhku4/',
        'https://s.coze.cn/image/CoLslFuryr0/',
        'https://s.coze.cn/image/AJ4TSlfEaAU/'
      ],
      category: '虚拟商品'
    },
    '3': {
      id: '3',
      name: '智能客服系统 - 7x24小时在线服务',
      price: '¥1,599',
      originalPrice: '¥2,199',
      rating: 4.7,
      reviewCount: 67,
      salesCount: 89,
      stock: 200,
      badge: '新品',
      badgeClass: 'bg-success',
      images: [
        'https://s.coze.cn/image/rOIRmxnNDqQ/',
        'https://s.coze.cn/image/UXOSw05FNHo/',
        'https://s.coze.cn/image/MJUY5xMpPtY/'
      ],
      category: '软件工具'
    }
  };

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '商品详情 - 云商速构';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 加载商品数据
  useEffect(() => {
    const productId = searchParams.get('id') || searchParams.get('product') || '1';
    const product = mockProducts[productId] || mockProducts['1'];
    setCurrentProduct(product);
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

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 点击页面其他地方关闭客服面板
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('#floating-customer-service')) {
        setIsServicePanelVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
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

  const handleQuickOrdersClick = () => {
    navigate('/user-center');
  };

  const handleQuickHelpClick = () => {
    navigate('/help-center');
  };

  const handleUserMenuClick = () => {
    navigate('/user-center');
  };

  const handleThumbnailClick = (imageSrc: string) => {
    if (currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        images: [imageSrc, ...currentProduct.images.filter(img => img !== imageSrc)]
      });
    }
  };

  const handleMainImageClick = () => {
    console.log('打开图片预览');
  };

  const handleVersionSelect = (version: string) => {
    setSelectedVersion(version);
  };

  const handleDurationSelect = (duration: string) => {
    setSelectedDuration(duration);
  };

  const handleQuantityDecrease = () => {
    if (productQuantity > 1) {
      setProductQuantity(productQuantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    if (currentProduct && productQuantity < currentProduct.stock) {
      setProductQuantity(productQuantity + 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let quantity = parseInt(e.target.value);
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
    } else if (currentProduct && quantity > currentProduct.stock) {
      quantity = currentProduct.stock;
    }
    setProductQuantity(quantity);
  };

  const handleBuyNowClick = () => {
    const productId = searchParams.get('id') || searchParams.get('product') || '1';
    navigate(`/checkout?product=${productId}`);
  };

  const handleAddToCartClick = () => {
    alert('商品已加入购物车');
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleServiceToggle = () => {
    setIsServicePanelVisible(!isServicePanelVisible);
  };

  if (!currentProduct) {
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
                src="https://s.coze.cn/image/XrH7eIVJR6w/" 
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
        } ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
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
                  className={`${styles.categoryItem} flex items-center px-3 py-2 rounded-lg text-sm text-primary bg-blue-50 w-full text-left`}
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
            {/* 面包屑导航 */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-text-secondary">
                <li><Link to="/home" className="hover:text-primary">首页</Link></li>
                <li><i className="fas fa-chevron-right text-xs"></i></li>
                <li><Link to={`/product-list?category=${currentProduct.category}`} className="hover:text-primary">{currentProduct.category}</Link></li>
                <li><i className="fas fa-chevron-right text-xs"></i></li>
                <li className="text-text-primary">{currentProduct.name}</li>
              </ol>
            </nav>

            {/* 商品详情内容 */}
            <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
              {/* 商品图片和信息 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* 商品图片 */}
                <div>
                  <div className="relative mb-4">
                    <img 
                      src={currentProduct.images[0]} 
                      alt={currentProduct.name} 
                      onClick={handleMainImageClick}
                      className={`w-full h-96 object-cover rounded-xl ${styles.productImageZoom} cursor-pointer`}
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`${currentProduct.badgeClass} text-white text-xs px-2 py-1 rounded-full`}>{currentProduct.badge}</span>
                    </div>
                  </div>
                  {/* 缩略图 */}
                  <div className="flex space-x-2">
                    {currentProduct.images.map((image, index) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`商品图片${index + 1}`} 
                        onClick={() => handleThumbnailClick(image)}
                        className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${
                          index === 0 ? 'border-primary' : 'border-border-light hover:border-primary'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* 商品信息 */}
                <div>
                  <h1 className="text-3xl font-bold text-text-primary mb-4">{currentProduct.name}</h1>
                  
                  {/* 商品评分 */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      <i className="fas fa-star text-yellow-400"></i>
                      <i className="fas fa-star text-yellow-400"></i>
                      <i className="fas fa-star text-yellow-400"></i>
                      <i className="fas fa-star text-yellow-400"></i>
                      <i className="fas fa-star text-yellow-400"></i>
                    </div>
                    <span className="ml-2 text-text-secondary text-sm">{currentProduct.rating} ({currentProduct.reviewCount}条评价)</span>
                    <span className="ml-4 text-text-secondary text-sm">已售 {currentProduct.salesCount} 件</span>
                  </div>

                  {/* 商品价格 */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl font-bold text-primary">{currentProduct.price}</span>
                      <span className="text-lg text-text-secondary line-through">{currentProduct.originalPrice}</span>
                      <span className="bg-danger text-white px-2 py-1 rounded text-sm">省 ¥1,000</span>
                    </div>
                  </div>

                  {/* 商品规格 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-3">商品规格</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">版本选择</label>
                        <div className="flex flex-wrap gap-2">
                          {['基础版', '高级版', '企业版'].map((version) => (
                            <button 
                              key={version}
                              onClick={() => handleVersionSelect(version)}
                              className={`${styles.specItem} px-4 py-2 rounded-lg text-sm ${
                                selectedVersion === version ? 'active' : ''
                              }`}
                            >
                              {version}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">服务期限</label>
                        <div className="flex flex-wrap gap-2">
                          {['1年', '2年', '3年'].map((duration) => (
                            <button 
                              key={duration}
                              onClick={() => handleDurationSelect(duration)}
                              className={`${styles.specItem} px-4 py-2 rounded-lg text-sm ${
                                selectedDuration === duration ? 'active' : ''
                              }`}
                            >
                              {duration}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 库存信息 */}
                  <div className="mb-6">
                    <span className="text-text-secondary text-sm">库存：</span>
                    <span className="text-success font-medium">{currentProduct.stock} 件</span>
                  </div>

                  {/* 购买数量 */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-text-secondary mb-2">购买数量</label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-border-light rounded-lg">
                        <button 
                          onClick={handleQuantityDecrease}
                          className="px-3 py-2 text-text-secondary hover:text-primary"
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <input 
                          type="number" 
                          value={productQuantity} 
                          min="1" 
                          max={currentProduct.stock}
                          onChange={handleQuantityChange}
                          className={`w-16 text-center border-0 ${styles.quantityInput}`}
                        />
                        <button 
                          onClick={handleQuantityIncrease}
                          className="px-3 py-2 text-text-secondary hover:text-primary"
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                      <span className="text-text-secondary text-sm">最多购买 {currentProduct.stock} 件</span>
                    </div>
                  </div>

                  {/* 购买按钮 */}
                  <div className="flex space-x-4">
                    <button 
                      onClick={handleBuyNowClick}
                      className="flex-1 bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 transition-colors"
                    >
                      <i className="fas fa-shopping-cart mr-2"></i>
                      立即购买
                    </button>
                    <button 
                      onClick={handleAddToCartClick}
                      className="px-8 py-4 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors"
                    >
                      <i className="fas fa-plus mr-2"></i>
                      加入购物车
                    </button>
                  </div>
                </div>
              </div>

              {/* 商品详情标签页 */}
              <div className="border-t border-border-light">
                <div className="flex border-b border-border-light">
                  <button 
                    onClick={() => handleTabClick('description')}
                    className={`px-6 py-4 font-medium ${
                      activeTab === 'description' 
                        ? 'text-primary border-b-2 border-primary' 
                        : 'text-text-secondary hover:text-primary'
                    }`}
                  >
                    商品详情
                  </button>
                  <button 
                    onClick={() => handleTabClick('specifications')}
                    className={`px-6 py-4 font-medium ${
                      activeTab === 'specifications' 
                        ? 'text-primary border-b-2 border-primary' 
                        : 'text-text-secondary hover:text-primary'
                    }`}
                  >
                    规格参数
                  </button>
                  <button 
                    onClick={() => handleTabClick('reviews')}
                    className={`px-6 py-4 font-medium ${
                      activeTab === 'reviews' 
                        ? 'text-primary border-b-2 border-primary' 
                        : 'text-text-secondary hover:text-primary'
                    }`}
                  >
                    用户评价
                  </button>
                </div>

                {/* 商品详情内容 */}
                {activeTab === 'description' && (
                  <div className="p-6">
                    <div className="prose max-w-none">
                      <h3 className="text-xl font-semibold text-text-primary mb-4">产品介绍</h3>
                      <p className="text-text-secondary mb-6 leading-relaxed">
                        电商系统基础版是一款专为中小企业和创业者打造的快速上线解决方案。无需复杂的技术知识，3-5天即可完成整个电商系统的构建与部署，让您专注于业务发展而非技术实现。
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-bg-light rounded-xl p-6">
                          <h4 className="font-semibold text-text-primary mb-3">核心功能</h4>
                          <ul className="space-y-2 text-text-secondary">
                            <li className="flex items-center">
                              <i className="fas fa-check text-success mr-2"></i>
                              用户注册登录系统
                            </li>
                            <li className="flex items-center">
                              <i className="fas fa-check text-success mr-2"></i>
                              商品管理与展示
                            </li>
                            <li className="flex items-center">
                              <i className="fas fa-check text-success mr-2"></i>
                              订单处理流程
                            </li>
                            <li className="flex items-center">
                              <i className="fas fa-check text-success mr-2"></i>
                              支付系统集成
                            </li>
                            <li className="flex items-center">
                              <i className="fas fa-check text-success mr-2"></i>
                              后台管理系统
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-bg-light rounded-xl p-6">
                          <h4 className="font-semibold text-text-primary mb-3">技术优势</h4>
                          <ul className="space-y-2 text-text-secondary">
                            <li className="flex items-center">
                              <i className="fas fa-check text-success mr-2"></i>
                              前后端分离架构
                            </li>
                            <li className="flex items-center">
                              <i className="fas fa-check text-success mr-2"></i>
                              容器化部署
                            </li>
                            <li className="flex items-center">
                              <i className="fas fa-check text-success mr-2"></i>
                              自动化运维
                            </li>
                            <li className="flex items-center">
                              <i className="fas fa-check text-success mr-2"></i>
                              多重安全防护
                            </li>
                            <li className="flex items-center">
                              <i className="fas fa-check text-success mr-2"></i>
                              7x24技术支持
                            </li>
                          </ul>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-text-primary mb-4">部署流程</h3>
                      <div className="bg-white border border-border-light rounded-xl p-6 mb-6">
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                            <div>
                              <h4 className="font-semibold text-text-primary">环境准备</h4>
                              <p className="text-text-secondary">准备Linux服务器，安装Docker环境</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                            <div>
                              <h4 className="font-semibold text-text-primary">配置参数</h4>
                              <p className="text-text-secondary">设置域名、支付密钥等必要参数</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                            <div>
                              <h4 className="font-semibold text-text-primary">一键部署</h4>
                              <p className="text-text-secondary">执行部署脚本，自动完成系统搭建</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">4</div>
                            <div>
                              <h4 className="font-semibold text-text-primary">上线运营</h4>
                              <p className="text-text-secondary">系统测试通过后即可正式上线</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 规格参数内容 */}
                {activeTab === 'specifications' && (
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="bg-bg-light rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">系统规格</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex justify-between py-2 border-b border-border-light">
                            <span className="text-text-secondary">开发语言</span>
                            <span className="text-text-primary">Node.js + React</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border-light">
                            <span className="text-text-secondary">数据库</span>
                            <span className="text-text-primary">MySQL + Redis</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border-light">
                            <span className="text-text-secondary">部署方式</span>
                            <span className="text-text-primary">Docker容器化</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border-light">
                            <span className="text-text-secondary">服务器要求</span>
                            <span className="text-text-primary">2核4G以上</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border-light">
                            <span className="text-text-secondary">并发支持</span>
                            <span className="text-text-primary">1000+ QPS</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border-light">
                            <span className="text-text-secondary">安全协议</span>
                            <span className="text-text-primary">HTTPS</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-bg-light rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">功能模块</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium text-text-primary mb-2">用户管理</h4>
                            <ul className="text-sm text-text-secondary space-y-1">
                              <li>• 注册登录</li>
                              <li>• 权限管理</li>
                              <li>• 个人中心</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-text-primary mb-2">商品管理</h4>
                            <ul className="text-sm text-text-secondary space-y-1">
                              <li>• 商品上架</li>
                              <li>• 分类管理</li>
                              <li>• 库存管理</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-text-primary mb-2">订单支付</h4>
                            <ul className="text-sm text-text-secondary space-y-1">
                              <li>• 订单处理</li>
                              <li>• 支付集成</li>
                              <li>• 退款处理</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 用户评价内容 */}
                {activeTab === 'reviews' && (
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-primary">4.9</div>
                            <div className="flex items-center justify-center mt-1">
                              <i className="fas fa-star text-yellow-400"></i>
                              <i className="fas fa-star text-yellow-400"></i>
                              <i className="fas fa-star text-yellow-400"></i>
                              <i className="fas fa-star text-yellow-400"></i>
                              <i className="fas fa-star text-yellow-400"></i>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-text-secondary">5星</span>
                              <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                                <div className="bg-yellow-400 h-2 rounded-full" style={{width: '90%'}}></div>
                              </div>
                              <span className="text-text-secondary text-sm">90%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-text-secondary">4星</span>
                              <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                                <div className="bg-yellow-400 h-2 rounded-full" style={{width: '8%'}}></div>
                              </div>
                              <span className="text-text-secondary text-sm">8%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-text-secondary">3星</span>
                              <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                                <div className="bg-yellow-400 h-2 rounded-full" style={{width: '2%'}}></div>
                              </div>
                              <span className="text-text-secondary text-sm">2%</span>
                            </div>
                          </div>
                        </div>

                        {/* 评价列表 */}
                        <div className="space-y-4">
                          <div className="border border-border-light rounded-xl p-6">
                            <div className="flex items-start space-x-4">
                              <img 
                                src="https://s.coze.cn/image/3EfN6PCUnck/" 
                                alt="用户头像" 
                                className="w-12 h-12 rounded-full"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-text-primary">王老板</span>
                                  <span className="text-text-secondary text-sm">2024-01-15</span>
                                </div>
                                <div className="flex items-center mb-2">
                                  <i className="fas fa-star text-yellow-400"></i>
                                  <i className="fas fa-star text-yellow-400"></i>
                                  <i className="fas fa-star text-yellow-400"></i>
                                  <i className="fas fa-star text-yellow-400"></i>
                                  <i className="fas fa-star text-yellow-400"></i>
                                </div>
                                <p className="text-text-secondary">
                                  系统部署很简单，按照文档一步步操作，3天就完成了整个电商平台的搭建。客服很耐心，遇到问题都能及时解决。推荐给需要快速上线的创业者！
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="border border-border-light rounded-xl p-6">
                            <div className="flex items-start space-x-4">
                              <img 
                                src="https://s.coze.cn/image/EzhCoKw5TsA/" 
                                alt="用户头像" 
                                className="w-12 h-12 rounded-full"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-text-primary">李经理</span>
                                  <span className="text-text-secondary text-sm">2024-01-12</span>
                                </div>
                                <div className="flex items-center mb-2">
                                  <i className="fas fa-star text-yellow-400"></i>
                                  <i className="fas fa-star text-yellow-400"></i>
                                  <i className="fas fa-star text-yellow-400"></i>
                                  <i className="fas fa-star text-yellow-400"></i>
                                  <i className="fas fa-star text-yellow-400"></i>
                                </div>
                                <p className="text-text-secondary">
                                  作为技术小白，本来以为搭建电商系统会很复杂，没想到这么简单。一键部署真的很方便，现在系统运行很稳定，功能也很完善。
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="border border-border-light rounded-xl p-6">
                            <div className="flex items-start space-x-4">
                              <img 
                                src="https://s.coze.cn/image/6E0kaolK0T4/" 
                                alt="用户头像" 
                                className="w-12 h-12 rounded-full"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-text-primary">张老师</span>
                                  <span className="text-text-secondary text-sm">2024-01-10</span>
                                </div>
                                <div className="flex items-center mb-2">
                                  <i className="fas fa-star text-yellow-400"></i>
                                  <i className="fas fa-star text-yellow-400"></i>
                                  <i className="fas fa-star text-yellow-400"></i>
                                  <i className="fas fa-star text-yellow-400"></i>
                                  <i className="fas fa-star text-gray-300"></i>
                                </div>
                                <p className="text-text-secondary">
                                  整体体验不错，部署过程很顺利。希望后续能增加更多的营销功能，比如优惠券、积分系统等。技术支持很专业，响应很快。
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
      
      {/* 悬浮智能客服 */}
      <div id="floating-customer-service" className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={handleServiceToggle}
          className="w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
        >
          <i className="fas fa-comments text-xl"></i>
        </button>
        {isServicePanelVisible && (
          <div className="absolute bottom-16 right-0 w-64 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform origin-bottom-right">
            <div className="bg-primary text-white p-4">
              <h3 className="font-semibold">智能客服</h3>
              <p className="text-xs opacity-90">工作日 9:00-18:00</p>
            </div>
            <div className="p-4">
              <p className="text-sm text-text-secondary mb-4">有什么可以帮助您的吗？</p>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm">
                  <i className="fas fa-question-circle text-primary mr-2"></i>产品咨询
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm">
                  <i className="fas fa-shopping-cart text-primary mr-2"></i>订单问题
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm">
                  <i className="fas fa-cog text-primary mr-2"></i>技术支持
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm">
                  <i className="fas fa-envelope text-primary mr-2"></i>留言反馈
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;

