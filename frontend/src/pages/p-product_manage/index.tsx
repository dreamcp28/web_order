

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  category: string;
  categoryName: string;
  description?: string;
}

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: string;
  stock: string;
  status: 'active' | 'inactive';
  image?: File;
  virtualAccountTemplate?: string;
}

const ProductManagePage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "电商系统基础版 - 快速上线解决方案",
      image: "https://s.coze.cn/image/6yh9rPoJZDQ/",
      price: 2999,
      stock: 50,
      status: "active",
      category: "virtual",
      categoryName: "虚拟商品"
    },
    {
      id: 2,
      name: "企业级电商平台 - 全功能定制版",
      image: "https://s.coze.cn/image/_KB-DY7ZApQ/",
      price: 8999,
      stock: 20,
      status: "active",
      category: "software",
      categoryName: "软件工具"
    },
    {
      id: 3,
      name: "智能客服系统 - 7x24小时在线服务",
      image: "https://s.coze.cn/image/FaLPUg0E4yg/",
      price: 1599,
      stock: 30,
      status: "inactive",
      category: "service",
      categoryName: "技术服务"
    },
    {
      id: 4,
      name: "DevOps自动化部署 - 一键上线运维",
      image: "https://s.coze.cn/image/7Es2T-lyjNE/",
      price: 3999,
      stock: 15,
      status: "active",
      category: "software",
      categoryName: "软件工具"
    },
    {
      id: 5,
      name: "移动端商城 - 小程序+H5全端覆盖",
      image: "https://s.coze.cn/image/6m3lO0D8cm8/",
      price: 4599,
      stock: 25,
      status: "active",
      category: "template",
      categoryName: "网站模板"
    },
    {
      id: 6,
      name: "数据分析平台 - 商业智能决策",
      image: "https://s.coze.cn/image/hsPnNqL7n1E/",
      price: 6999,
      stock: 10,
      status: "active",
      category: "service",
      categoryName: "技术服务"
    },
    {
      id: 7,
      name: "多语言商城 - 全球化业务拓展",
      image: "https://s.coze.cn/image/YDuQSRMacfY/",
      price: 5299,
      stock: 18,
      status: "active",
      category: "template",
      categoryName: "网站模板"
    },
    {
      id: 8,
      name: "AI智能推荐 - 个性化购物体验",
      image: "https://s.coze.cn/image/n0Qa_Igou28/",
      price: 2299,
      stock: 35,
      status: "inactive",
      category: "software",
      categoryName: "软件工具"
    }
  ]);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isSidebarCollapsed, _setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productFormData, setProductFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    status: 'active'
  });

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '商品管理 - 云商速构管理后台';
    return () => { document.title = originalTitle; };
  }, []);

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

  // 筛选商品
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = !searchKeyword || product.name.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchesStatus = !statusFilter || product.status === statusFilter;
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchKeyword, statusFilter, categoryFilter, products]);

  // 计算分页
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageProducts = filteredProducts.slice(startIndex, endIndex);

  // 事件处理函数
  const handleSidebarToggle = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleSidebarOverlayClick = () => {
    setIsSidebarVisible(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearchSubmit = () => {
    // 筛选逻辑已在useEffect中处理
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setStatusFilter('');
    setCategoryFilter('');
  };

  const handleAddProductClick = () => {
    setEditingProductId(null);
    setProductFormData({
      name: '',
      category: '',
      description: '',
      price: '',
      stock: '',
      status: 'active'
    });
    setIsProductModalVisible(true);
  };

  const handleEditProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setEditingProductId(productId);
      setProductFormData({
        name: product.name,
        category: product.category,
        description: product.description || '',
        price: product.price.toString(),
        stock: product.stock.toString(),
        status: product.status
      });
      setIsProductModalVisible(true);
    }
  };

  const handleDeleteProduct = (productId: number) => {
    setEditingProductId(productId);
    setIsDeleteModalVisible(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalVisible(false);
    setEditingProductId(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setEditingProductId(null);
  };

  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProductData: Product = {
      id: editingProductId || Math.max(...products.map(p => p.id)) + 1,
      name: productFormData.name,
      category: productFormData.category,
      categoryName: getCategoryName(productFormData.category),
      price: parseFloat(productFormData.price),
      stock: parseInt(productFormData.stock),
      status: productFormData.status,
      description: productFormData.description,
      image: "https://s.coze.cn/image/6IxueAkz4a4/" // 临时图片
    };

    if (editingProductId) {
      setProducts(prev => prev.map(p => p.id === editingProductId ? { ...p, ...newProductData } : p));
      showSuccessMessage('商品更新成功');
    } else {
      setProducts(prev => [...prev, newProductData]);
      showSuccessMessage('商品添加成功');
    }

    handleCloseProductModal();
  };

  const handleConfirmDelete = () => {
    if (editingProductId) {
      setProducts(prev => prev.map(p => p.id === editingProductId ? { ...p, status: 'inactive' } : p));
      showSuccessMessage('商品已下架');
    }
    handleCloseDeleteModal();
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      navigate('/admin-login');
    }
  };

  // 工具函数
  const getCategoryName = (categoryValue: string): string => {
    const categoryMap: Record<string, string> = {
      'virtual': '虚拟商品',
      'software': '软件工具',
      'service': '技术服务',
      'template': '网站模板'
    };
    return categoryMap[categoryValue] || categoryValue;
  };

  const showSuccessMessage = (message: string) => {
    // 创建临时提示元素
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-check-circle mr-2"></i>
        ${message}
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // 3秒后自动移除
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  };

  // 渲染分页页码
  const renderPageNumbers = () => {
    const pageNumbers = [];
    
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 border rounded ${i === currentPage ? 'bg-primary text-white border-primary' : 'border-border-light hover:bg-gray-50'}`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pageNumbers.push(
          <span key={`ellipsis-${i}`} className="px-2 text-text-secondary">...</span>
        );
      }
    }

    return pageNumbers;
  };

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
                src="https://s.coze.cn/image/TqLyyDPfyYM/" 
                alt="管理员头像" 
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-text-primary hidden md:block">管理员</span>
              <i className="fas fa-chevron-down text-xs text-text-secondary hidden md:block"></i>
            </div>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-100">
              <i className="fas fa-sign-out-alt text-gray-600"></i>
            </button>
          </div>
        </div>
      </header>

      {/* 主容器 */}
      <div className="flex pt-16">
        {/* 左侧菜单 */}
        <aside className={`fixed left-0 top-16 bottom-0 bg-white border-r border-border-light transition-all duration-300 z-40 lg:relative lg:top-0 ${isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded} ${!isSidebarVisible && !isSidebarCollapsed ? '-translate-x-full' : ''}`}>
          <div className="h-full overflow-y-auto">
            {/* 管理菜单 */}
            <div className="p-4">
              <nav className="space-y-1">
                <Link to="/admin-dashboard" className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-tachometer-alt w-5 text-center"></i>
                  <span className="ml-3">控制台</span>
                </Link>
                <Link to="/product-manage" className={`${styles.navLink} ${styles.active} flex items-center px-3 py-2 rounded-lg text-sm text-primary`}>
                  <i className="fas fa-box w-5 text-center"></i>
                  <span className="ml-3">商品管理</span>
                </Link>
                <Link to="/order-manage" className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-receipt w-5 text-center"></i>
                  <span className="ml-3">订单管理</span>
                </Link>
                <Link to="/payment-config" className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-credit-card w-5 text-center"></i>
                  <span className="ml-3">支付配置</span>
                </Link>
                <Link to="/security-settings" className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-shield-alt w-5 text-center"></i>
                  <span className="ml-3">安全设置</span>
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="p-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">商品管理</h1>
                <nav className="flex items-center space-x-2 text-sm text-text-secondary mt-1">
                  <Link to="/admin-dashboard" className="hover:text-primary">控制台</Link>
                  <i className="fas fa-chevron-right text-xs"></i>
                  <span>商品管理</span>
                </nav>
              </div>
              <button 
                onClick={handleAddProductClick}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>
                新增商品
              </button>
            </div>

            {/* 工具栏 */}
            <div className="bg-white rounded-xl shadow-card p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                {/* 搜索框 */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={searchKeyword}
                      onChange={handleSearchInputChange}
                      onKeyPress={handleSearchKeyPress}
                      placeholder="搜索商品名称..." 
                      className={`w-64 pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchInput}`}
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                  </div>
                  <button 
                    onClick={handleSearchSubmit}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    搜索
                  </button>
                </div>
                
                {/* 筛选条件 */}
                <div className="flex items-center space-x-4">
                  <select 
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    className={`px-3 py-2 border border-border-light rounded-lg ${styles.formInput}`}
                  >
                    <option value="">全部状态</option>
                    <option value="active">在售</option>
                    <option value="inactive">下架</option>
                  </select>
                  <select 
                    value={categoryFilter}
                    onChange={handleCategoryFilterChange}
                    className={`px-3 py-2 border border-border-light rounded-lg ${styles.formInput}`}
                  >
                    <option value="">全部分类</option>
                    <option value="virtual">虚拟商品</option>
                    <option value="software">软件工具</option>
                    <option value="service">技术服务</option>
                    <option value="template">网站模板</option>
                  </select>
                  <button 
                    onClick={handleResetFilters}
                    className="border border-border-light text-text-secondary px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    重置
                  </button>
                </div>
              </div>
            </div>

            {/* 商品列表 */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-border-light">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">商品名称</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">图片</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">价格</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">库存</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">状态</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">分类</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-border-light">
                    {currentPageProducts.map(product => (
                      <tr key={product.id} className={styles.tableRow}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-text-primary">{product.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                          ¥{product.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                          {product.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.status === 'active' ? styles.statusBadgeActive : styles.statusBadgeInactive}`}>
                            {product.status === 'active' ? '在售' : '下架'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {product.categoryName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button 
                            onClick={() => handleEditProduct(product.id)}
                            className="text-primary hover:text-blue-600"
                          >
                            <i className="fas fa-edit mr-1"></i>编辑
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-danger hover:text-red-600"
                          >
                            <i className="fas fa-trash mr-1"></i>下架
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* 分页 */}
              <div className="px-6 py-4 border-t border-border-light">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-text-secondary">
                    显示 <span>{filteredProducts.length > 0 ? startIndex + 1 : 0}</span> 到 <span>{Math.min(endIndex, filteredProducts.length)}</span> 条，共 <span>{filteredProducts.length}</span> 条记录
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-border-light rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <div className="flex space-x-1">
                      {renderPageNumbers()}
                    </div>
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="px-3 py-1 border border-border-light rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 侧边栏遮罩（移动端） */}
      <div 
        onClick={handleSidebarOverlayClick}
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden ${!isSidebarVisible ? 'hidden' : ''}`}
      ></div>

      {/* 商品表单模态框 */}
      {isProductModalVisible && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalBackdrop}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-border-light">
                <h2 className="text-xl font-semibold text-text-primary">
                  {editingProductId ? '编辑商品' : '新增商品'}
                </h2>
                <button 
                  onClick={handleCloseProductModal}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <i className="fas fa-times text-gray-600"></i>
                </button>
              </div>
              
              <form onSubmit={handleProductFormSubmit} className="p-6 space-y-6">
                {/* 商品基本信息 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-text-primary">基本信息</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-text-primary">商品名称 *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name"
                        value={productFormData.name}
                        onChange={handleProductFormChange}
                        className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInput}`}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="category" className="block text-sm font-medium text-text-primary">商品分类 *</label>
                      <select 
                        id="category" 
                        name="category"
                        value={productFormData.category}
                        onChange={handleProductFormChange}
                        className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInput}`}
                        required
                      >
                        <option value="">请选择分类</option>
                        <option value="virtual">虚拟商品</option>
                        <option value="software">软件工具</option>
                        <option value="service">技术服务</option>
                        <option value="template">网站模板</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-text-primary">商品描述</label>
                    <textarea 
                      id="description" 
                      name="description"
                      rows={4}
                      value={productFormData.description}
                      onChange={handleProductFormChange}
                      className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInput}`}
                      placeholder="请输入商品描述..."
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="price" className="block text-sm font-medium text-text-primary">商品价格 *</label>
                      <input 
                        type="number" 
                        id="price" 
                        name="price"
                        step="0.01" 
                        min="0"
                        value={productFormData.price}
                        onChange={handleProductFormChange}
                        className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInput}`}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="stock" className="block text-sm font-medium text-text-primary">商品库存 *</label>
                      <input 
                        type="number" 
                        id="stock" 
                        name="stock"
                        min="0"
                        value={productFormData.stock}
                        onChange={handleProductFormChange}
                        className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInput}`}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="image" className="block text-sm font-medium text-text-primary">商品图片</label>
                    <input 
                      type="file" 
                      id="image" 
                      name="image"
                      accept="image/*"
                      className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInput}`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="status" className="block text-sm font-medium text-text-primary">商品状态</label>
                    <select 
                      id="status" 
                      name="status"
                      value={productFormData.status}
                      onChange={handleProductFormChange}
                      className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInput}`}
                    >
                      <option value="active">在售</option>
                      <option value="inactive">下架</option>
                    </select>
                  </div>
                </div>
                
                {/* 虚拟商品信息 */}
                {productFormData.category === 'virtual' && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-medium text-text-primary">虚拟商品信息</h3>
                    
                    <div className="space-y-2">
                      <label htmlFor="virtualAccountTemplate" className="block text-sm font-medium text-text-primary">账号密码模板</label>
                      <textarea 
                        id="virtualAccountTemplate" 
                        name="virtualAccountTemplate"
                        rows={3}
                        value={productFormData.virtualAccountTemplate || ''}
                        onChange={handleProductFormChange}
                        className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInput}`}
                        placeholder="例如：账号：{username}，密码：{password}"
                      ></textarea>
                    </div>
                  </div>
                )}
                
                {/* 操作按钮 */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <button 
                    type="button" 
                    onClick={handleCloseProductModal}
                    className="px-6 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    保存商品
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 下架确认模态框 */}
      {isDeleteModalVisible && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalBackdrop}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-danger bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-exclamation-triangle text-danger text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">确认下架商品</h3>
                <p className="text-text-secondary mb-6">下架后商品将在用户端不可见，确定要继续吗？</p>
                <div className="flex space-x-3">
                  <button 
                    onClick={handleCloseDeleteModal}
                    className="flex-1 px-4 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleConfirmDelete}
                    className="flex-1 px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    确认下架
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagePage;

