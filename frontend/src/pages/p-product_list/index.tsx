

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sales: number;
  rating: number;
  reviewCount: number;
  category: string;
  image: string;
  badge?: string;
  badgeColor?: string;
}

const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 页面状态
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [currentSearch, setCurrentSearch] = useState<string>('');
  const [currentPriceFilter, setCurrentPriceFilter] = useState<string>('all');
  const [currentSort, setCurrentSort] = useState<string>('default');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  const pageSize = 8;

  // 模拟商品数据
  const mockProducts: Product[] = [
    {
      id: 'prod1',
      name: '电商系统基础版 - 快速上线解决方案',
      price: 2999,
      originalPrice: 3999,
      stock: 50,
      sales: 356,
      rating: 4.9,
      reviewCount: 128,
      category: 'virtual',
      image: 'https://s.coze.cn/image/mpOKQME0_bE/',
      badge: '热销',
      badgeColor: 'danger'
    },
    {
      id: 'prod2',
      name: '企业级电商平台 - 全功能定制版',
      price: 8999,
      stock: 20,
      sales: 124,
      rating: 4.8,
      reviewCount: 89,
      category: 'virtual',
      image: 'https://s.coze.cn/image/8t9ilfcUTKw/',
      badge: '推荐',
      badgeColor: 'warning'
    },
    {
      id: 'prod3',
      name: '智能客服系统 - 7x24小时在线服务',
      price: 1599,
      stock: 30,
      sales: 89,
      rating: 4.7,
      reviewCount: 67,
      category: 'software',
      image: 'https://s.coze.cn/image/q-icZtrQ19U/',
      badge: '新品',
      badgeColor: 'success'
    },
    {
      id: 'prod4',
      name: 'DevOps自动化部署 - 一键上线运维',
      price: 3999,
      stock: 25,
      sales: 234,
      rating: 4.9,
      reviewCount: 156,
      category: 'service',
      image: 'https://s.coze.cn/image/HQSZiprjGIM/'
    },
    {
      id: 'prod5',
      name: '移动端商城 - 小程序+H5全端覆盖',
      price: 4599,
      stock: 15,
      sales: 45,
      rating: 4.6,
      reviewCount: 23,
      category: 'template',
      image: 'https://s.coze.cn/image/W8peRctGKNw/',
      badge: '新品',
      badgeColor: 'info'
    },
    {
      id: 'prod6',
      name: '数据分析平台 - 商业智能决策',
      price: 6999,
      stock: 10,
      sales: 28,
      rating: 4.8,
      reviewCount: 15,
      category: 'software',
      image: 'https://s.coze.cn/image/T9rPNqtE89I/',
      badge: '新品',
      badgeColor: 'info'
    },
    {
      id: 'prod7',
      name: '多语言商城 - 全球化业务拓展',
      price: 5299,
      stock: 18,
      sales: 32,
      rating: 4.7,
      reviewCount: 19,
      category: 'template',
      image: 'https://s.coze.cn/image/9iBXo6s_X8g/',
      badge: '新品',
      badgeColor: 'info'
    },
    {
      id: 'prod8',
      name: 'AI智能推荐 - 个性化购物体验',
      price: 2299,
      stock: 40,
      sales: 18,
      rating: 4.5,
      reviewCount: 12,
      category: 'software',
      image: 'https://s.coze.cn/image/gEck8UU1mGU/',
      badge: '新品',
      badgeColor: 'info'
    }
  ];

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '商品列表 - 云商速构';
    return () => { document.title = originalTitle; };
  }, []);

  // 解析URL参数
  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'default';
    const page = parseInt(searchParams.get('page') || '1');
    
    setCurrentCategory(category);
    setCurrentSearch(search);
    setCurrentSort(sort);
    setCurrentPage(page);
  }, [searchParams]);

  // 更新URL参数
  const updateUrlParams = () => {
    const params = new URLSearchParams();
    
    if (currentCategory !== 'all') {
      params.append('category', currentCategory);
    }
    
    if (currentSearch) {
      params.append('search', currentSearch);
    }
    
    if (currentSort !== 'default') {
      params.append('sort', currentSort);
    }
    
    if (currentPage > 1) {
      params.append('page', currentPage.toString());
    }
    
    setSearchParams(params);
  };

  // 获取筛选后的商品
  const getFilteredProducts = (): Product[] => {
    return mockProducts.filter(product => {
      // 分类筛选
      if (currentCategory !== 'all' && product.category !== currentCategory) {
        return false;
      }
      
      // 搜索筛选
      if (currentSearch && !product.name.toLowerCase().includes(currentSearch.toLowerCase())) {
        return false;
      }
      
      // 价格筛选
      if (currentPriceFilter !== 'all') {
        const [minPrice, maxPrice] = getPriceRange(currentPriceFilter);
        if (product.price < minPrice || (maxPrice && product.price > maxPrice)) {
          return false;
        }
      }
      
      return true;
    });
  };

  // 获取价格范围
  const getPriceRange = (priceFilter: string): [number, number | null] => {
    switch (priceFilter) {
      case '0-1000':
        return [0, 1000];
      case '1000-3000':
        return [1000, 3000];
      case '3000+':
        return [3000, null];
      default:
        return [0, null];
    }
  };

  // 排序商品
  const sortProducts = (products: Product[]): Product[] => {
    switch (currentSort) {
      case 'price-asc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'sales-desc':
        return [...products].sort((a, b) => b.sales - a.sales);
      case 'newest':
        return [...products].reverse(); // 模拟最新上架
      default:
        return [...products];
    }
  };

  // 处理分类切换
  const handleCategoryChange = (category: string) => {
    if (category !== currentCategory) {
      setCurrentCategory(category);
      setCurrentPage(1);
      updateUrlParams();
    }
  };

  // 处理搜索
  const handleSearch = (keyword: string) => {
    if (keyword !== currentSearch) {
      setCurrentSearch(keyword);
      setCurrentPage(1);
      updateUrlParams();
    }
  };

  // 处理价格筛选
  const handlePriceFilterChange = (priceFilter: string) => {
    if (priceFilter !== currentPriceFilter) {
      setCurrentPriceFilter(priceFilter);
      setCurrentPage(1);
    }
  };

  // 处理排序
  const handleSortChange = (sortValue: string) => {
    if (sortValue !== currentSort) {
      setCurrentSort(sortValue);
      updateUrlParams();
    }
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      updateUrlParams();
    }
  };

  // 处理商品卡片点击
  const handleProductCardClick = (productId: string) => {
    navigate(`/product-detail?id=${productId}`);
  };

  // 处理购买按钮点击
  const handleBuyClick = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    navigate(`/checkout?product=${productId}`);
  };

  // 处理侧边栏切换
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 处理侧边栏遮罩点击
  const handleSidebarOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  // 获取分类标题
  const getCategoryTitle = (category: string): string => {
    const categoryTitles: { [key: string]: string } = {
      'all': '全部商品',
      'virtual': '虚拟商品',
      'software': '软件工具',
      'service': '技术服务',
      'template': '网站模板'
    };
    return categoryTitles[category] || '全部商品';
  };

  // 渲染分页
  const renderPagination = (totalCount: number) => {
    const totalPages = Math.ceil(totalCount / pageSize);
    
    // 计算显示的页码范围
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // 确保显示5个页码（如果可能）
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + 4);
      } else {
        startPage = Math.max(1, endPage - 4);
      }
    }
    
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-3 py-2 border border-border-light rounded-lg hover:bg-gray-50 ${i === currentPage ? styles.paginationButtonActive : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="flex items-center justify-center space-x-2">
        <button
          className="px-3 py-2 border border-border-light rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="flex space-x-1">
          {pageNumbers}
        </div>
        <button
          className="px-3 py-2 border border-border-light rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    );
  };

  // 渲染商品卡片
  const renderProductCard = (product: Product) => {
    const badgeHtml = product.badge ? (
      <div className="absolute top-3 left-3">
        <span className={`bg-${product.badgeColor || 'danger'} text-white text-xs px-2 py-1 rounded-full`}>
          {product.badge}
        </span>
      </div>
    ) : null;
    
    const originalPriceHtml = product.originalPrice ? (
      <span className="text-sm text-text-secondary line-through mr-2">
        ¥{product.originalPrice.toLocaleString()}
      </span>
    ) : null;
    
    return (
      <div
        key={product.id}
        className={`${styles.productCard} bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer`}
        onClick={() => handleProductCardClick(product.id)}
      >
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-xl"
            loading="lazy"
          />
          {badgeHtml}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {originalPriceHtml}
              <span className="text-2xl font-bold text-primary">
                ¥{product.price.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-text-secondary mb-3">
            <span>
              <i className="fas fa-star text-yellow-400 mr-1"></i>
              {product.rating} ({product.reviewCount})
            </span>
            <span>已售 {product.sales}</span>
          </div>
          <button
            className="w-full bg-primary text-white py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
            onClick={(e) => handleBuyClick(e, product.id)}
          >
            立即购买
          </button>
        </div>
      </div>
    );
  };

  // 主逻辑
  const filteredProducts = getFilteredProducts();
  const sortedProducts = sortProducts(filteredProducts);
  const totalCount = sortedProducts.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageProducts = sortedProducts.slice(startIndex, endIndex);

  return (
    <div className="bg-bg-light min-h-screen">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* 左侧：Logo和菜单切换 */}
          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              onClick={handleSidebarToggle}
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
                value={currentSearch}
                onChange={(e) => setCurrentSearch(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch((e.target as HTMLInputElement).value.trim());
                  }
                }}
                className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchInput}`}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
            </div>
          </div>
          
          {/* 右侧：用户操作 */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <i className="fas fa-shopping-cart text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <i className="fas fa-bell text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full"></span>
            </button>
            <Link
              to="/user-center"
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
            >
              <img
                src="https://s.coze.cn/image/rQj5CP8lFCg/"
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
        <aside className={`fixed left-0 top-16 bottom-0 bg-white border-r border-border-light ${styles.sidebarExpanded} transition-all duration-300 z-40 lg:relative lg:top-0 ${!isSidebarOpen && 'lg:translate-x-0 -translate-x-full'}`}>
          <div className="h-full overflow-y-auto">
            {/* 商品分类 */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                商品分类
              </h3>
              <nav className="space-y-1">
                <button
                  className={`${styles.categoryItem} flex items-center px-3 py-2 rounded-lg text-sm ${currentCategory === 'all' ? styles.categoryItemActive : 'text-text-primary'}`}
                  onClick={() => handleCategoryChange('all')}
                >
                  <i className="fas fa-th-large w-5 text-center"></i>
                  <span className="ml-3">全部商品</span>
                </button>
                <button
                  className={`${styles.categoryItem} flex items-center px-3 py-2 rounded-lg text-sm ${currentCategory === 'virtual' ? styles.categoryItemActive : 'text-text-primary'}`}
                  onClick={() => handleCategoryChange('virtual')}
                >
                  <i className="fas fa-key w-5 text-center"></i>
                  <span className="ml-3">虚拟商品</span>
                </button>
                <button
                  className={`${styles.categoryItem} flex items-center px-3 py-2 rounded-lg text-sm ${currentCategory === 'software' ? styles.categoryItemActive : 'text-text-primary'}`}
                  onClick={() => handleCategoryChange('software')}
                >
                  <i className="fas fa-laptop-code w-5 text-center"></i>
                  <span className="ml-3">软件工具</span>
                </button>
                <button
                  className={`${styles.categoryItem} flex items-center px-3 py-2 rounded-lg text-sm ${currentCategory === 'service' ? styles.categoryItemActive : 'text-text-primary'}`}
                  onClick={() => handleCategoryChange('service')}
                >
                  <i className="fas fa-handshake w-5 text-center"></i>
                  <span className="ml-3">技术服务</span>
                </button>
                <button
                  className={`${styles.categoryItem} flex items-center px-3 py-2 rounded-lg text-sm ${currentCategory === 'template' ? styles.categoryItemActive : 'text-text-primary'}`}
                  onClick={() => handleCategoryChange('template')}
                >
                  <i className="fas fa-layer-group w-5 text-center"></i>
                  <span className="ml-3">网站模板</span>
                </button>
              </nav>
            </div>
            
            {/* 快捷入口 */}
            <div className="p-4 border-t border-border-light">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                快捷入口
              </h3>
              <nav className="space-y-1">
                <Link
                  to="/user-center"
                  className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}
                >
                  <i className="fas fa-receipt w-5 text-center"></i>
                  <span className="ml-3">我的订单</span>
                </Link>
                <button className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-heart w-5 text-center"></i>
                  <span className="ml-3">收藏夹</span>
                </button>
                <Link
                  to="/help-center"
                  className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}
                >
                  <i className="fas fa-question-circle w-5 text-center"></i>
                  <span className="ml-3">帮助中心</span>
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
              {/* 面包屑导航 */}
              <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-4">
                <Link to="/home" className="hover:text-primary">
                  首页
                </Link>
                <i className="fas fa-chevron-right text-xs"></i>
                <span className="text-text-primary">{getCategoryTitle(currentCategory)}</span>
              </nav>
              
              {/* 分类标题 */}
              <h1 className="text-2xl font-bold text-text-primary">{getCategoryTitle(currentCategory)}</h1>
              <p className="text-text-secondary mt-1">
                共找到 <span>{totalCount}</span> 个商品
              </p>
            </div>

            {/* 工具栏 */}
            <div className="bg-white rounded-xl shadow-card p-4 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* 搜索和筛选 */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  {/* 搜索框 */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索商品名称..."
                      value={currentSearch}
                      onChange={(e) => setCurrentSearch(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch((e.target as HTMLInputElement).value.trim());
                        }
                      }}
                      className={`pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchInput} w-full sm:w-64`}
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                  </div>
                  
                  {/* 价格筛选 */}
                  <div className="flex space-x-2">
                    <button
                      className={`px-4 py-2 text-sm border border-border-light rounded-lg hover:bg-gray-50 ${currentPriceFilter === 'all' ? styles.filterButtonActive : ''}`}
                      onClick={() => handlePriceFilterChange('all')}
                    >
                      全部价格
                    </button>
                    <button
                      className={`px-4 py-2 text-sm border border-border-light rounded-lg hover:bg-gray-50 ${currentPriceFilter === '0-1000' ? styles.filterButtonActive : ''}`}
                      onClick={() => handlePriceFilterChange('0-1000')}
                    >
                      ¥0-1000
                    </button>
                    <button
                      className={`px-4 py-2 text-sm border border-border-light rounded-lg hover:bg-gray-50 ${currentPriceFilter === '1000-3000' ? styles.filterButtonActive : ''}`}
                      onClick={() => handlePriceFilterChange('1000-3000')}
                    >
                      ¥1000-3000
                    </button>
                    <button
                      className={`px-4 py-2 text-sm border border-border-light rounded-lg hover:bg-gray-50 ${currentPriceFilter === '3000+' ? styles.filterButtonActive : ''}`}
                      onClick={() => handlePriceFilterChange('3000+')}
                    >
                      ¥3000以上
                    </button>
                  </div>
                </div>
                
                {/* 排序 */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-text-secondary">排序：</span>
                  <select
                    value={currentSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="default">默认排序</option>
                    <option value="price-asc">价格从低到高</option>
                    <option value="price-desc">价格从高到低</option>
                    <option value="sales-desc">销量从高到低</option>
                    <option value="newest">最新上架</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 商品列表 */}
            <div className="mb-8">
              {pageProducts.length === 0 ? (
                <div className="text-center py-16">
                  <i className="fas fa-search text-6xl text-text-secondary mb-4"></i>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">没有找到相关商品</h3>
                  <p className="text-text-secondary">请尝试调整搜索条件或浏览其他分类</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {pageProducts.map(product => renderProductCard(product))}
                </div>
              )}
            </div>

            {/* 分页 */}
            {totalCount > 0 && renderPagination(totalCount)}
          </div>
        </main>
      </div>

      {/* 侧边栏遮罩（移动端） */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleSidebarOverlayClick}
        ></div>
      )}
    </div>
  );
};

export default ProductListPage;

