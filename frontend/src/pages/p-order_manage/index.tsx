

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { getOrders, updateOrderStatus, Order } from '../../api/orderApi';

// Order 接口已从 orderApi.ts 导入，这里保留用于兼容

interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  search: string;
  status: string;
  payment: string;
  startDate: string;
  endDate: string;
}

const OrderManagePage: React.FC = () => {
  const navigate = useNavigate();
  
  // 模拟订单数据（作为 fallback）
  const mockOrders: Order[] = [
    {
      id: 1,
      order_number: 'YS202401150001',
      user: '138****8888',
      product: '电商系统基础版',
      amount: 2999.00,
      status: 'paid',
      payment_method: 'wechat',
      created_at: '2024-01-15 10:30:25'
    },
    {
      id: 2,
      order_number: 'YS202401150002',
      user: '139****6666',
      product: '企业级电商平台',
      amount: 8999.00,
      status: 'pending',
      payment_method: 'alipay',
      created_at: '2024-01-15 11:45:12'
    },
    {
      id: 3,
      order_number: 'YS202401150003',
      user: '136****9999',
      product: '智能客服系统',
      amount: 1599.00,
      status: 'paid',
      payment_method: 'wechat',
      created_at: '2024-01-15 14:20:33'
    },
    {
      id: 4,
      order_number: 'YS202401150004',
      user: '137****5555',
      product: 'DevOps自动化部署',
      amount: 3999.00,
      status: 'cancelled',
      payment_method: 'alipay',
      created_at: '2024-01-15 09:15:47'
    },
    {
      id: 5,
      order_number: 'YS202401150005',
      user: '135****7777',
      product: '移动端商城',
      amount: 4599.00,
      status: 'refunded',
      payment_method: 'wechat',
      created_at: '2024-01-14 16:30:15'
    },
    {
      id: 6,
      order_number: 'YS202401150006',
      user: '138****4444',
      product: '数据分析平台',
      amount: 6999.00,
      status: 'paid',
      payment_method: 'alipay',
      created_at: '2024-01-14 13:10:22'
    },
    {
      id: 7,
      order_number: 'YS202401150007',
      user: '139****3333',
      product: '多语言商城',
      amount: 5299.00,
      status: 'pending',
      payment_method: 'wechat',
      created_at: '2024-01-14 18:45:55'
    },
    {
      id: 8,
      order_number: 'YS202401150008',
      user: '136****2222',
      product: 'AI智能推荐',
      amount: 2299.00,
      status: 'paid',
      payment_method: 'alipay',
      created_at: '2024-01-13 11:20:30'
    },
    {
      id: 9,
      order_number: 'YS202401150009',
      user: '137****1111',
      product: '电商系统基础版',
      amount: 2999.00,
      status: 'cancelled',
      payment_method: 'wechat',
      created_at: '2024-01-13 15:10:18'
    },
    {
      id: 10,
      order_number: 'YS202401150010',
      user: '135****0000',
      product: '企业级电商平台',
      amount: 8999.00,
      status: 'paid',
      payment_method: 'alipay',
      created_at: '2024-01-12 10:05:42'
    }
  ];

  // 状态管理
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortConfig>({ field: 'created_at', direction: 'desc' });
  const [currentFilters, setCurrentFilters] = useState<FilterConfig>({
    search: '',
    status: '',
    payment: '',
    startDate: '',
    endDate: ''
  });
  const [_isSidebarCollapsed, _setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const pageSize = 10;

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '订单管理 - 云商速构';
    return () => { document.title = originalTitle; };
  }, []);

  // 初始化页面默认日期范围（最近7天）
  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    const initialStartDate = startDate.toISOString().split('T')[0];
    const initialEndDate = endDate.toISOString().split('T')[0];
    
    setCurrentFilters(prev => ({
      ...prev,
      startDate: initialStartDate,
      endDate: initialEndDate
    }));
  }, []);

  // 从后端加载订单数据
  useEffect(() => {
    loadOrders();
  }, [currentFilters, currentSort, currentPage]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        pageSize: pageSize
      };

      if (currentFilters.search) {
        params.search = currentFilters.search;
      }
      if (currentFilters.status) {
        params.status = currentFilters.status;
      }
      if (currentFilters.payment) {
        params.payment_method = currentFilters.payment;
      }
      if (currentFilters.startDate) {
        params.startDate = currentFilters.startDate;
      }
      if (currentFilters.endDate) {
        params.endDate = currentFilters.endDate;
      }

      const response = await getOrders(params);
      setCurrentOrders(response.orders);
      setTotalOrders(response.pagination.total);
    } catch (error) {
      console.error('加载订单失败:', error);
      // 如果API失败，使用模拟数据作为fallback
      setCurrentOrders(mockOrders);
      setTotalOrders(mockOrders.length);
    } finally {
      setIsLoading(false);
    }
  };

  // 排序功能现在由后端处理，这里保留用于前端排序（如果需要）
  const sortOrders = (orders: Order[]): Order[] => {
    return orders.sort((a, b) => {
      let aValue = a[currentSort.field as keyof Order];
      let bValue = b[currentSort.field as keyof Order];

      if (currentSort.field === 'amount') {
        aValue = parseFloat(aValue as unknown as string);
        bValue = parseFloat(bValue as unknown as string);
      } else if (currentSort.field === 'created_at') {
        // 将日期转换为时间戳进行比较
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (aValue < bValue) {
        return currentSort.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return currentSort.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const handleSortChange = (field: string) => {
    const direction = currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';
    setCurrentSort({ field, direction });
    setCurrentPage(1); // 排序改变时重置到第一页
  };

  const handleSearchChange = (value: string) => {
    setCurrentFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(1); // 搜索改变时重置到第一页
  };

  const handleStatusFilterChange = (value: string) => {
    setCurrentFilters(prev => ({ ...prev, status: value }));
  };

  const handlePaymentFilterChange = (value: string) => {
    setCurrentFilters(prev => ({ ...prev, payment: value }));
  };

  const handleStartDateChange = (value: string) => {
    setCurrentFilters(prev => ({ ...prev, startDate: value }));
  };

  const handleEndDateChange = (value: string) => {
    setCurrentFilters(prev => ({ ...prev, endDate: value }));
  };

  const clearFilters = () => {
    setCurrentFilters({
      search: '',
      status: '',
      payment: '',
      startDate: '',
      endDate: ''
    });
    setCurrentPage(1); // 清除筛选时重置到第一页
  };

  const handleSidebarToggle = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleSidebarOverlayClick = () => {
    setIsSidebarVisible(false);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalOrders / pageSize);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewOrderDetail = (orderId: string | number) => {
    navigate(`/order-detail?id=${orderId}`);
  };

  const handleOpenStatusModal = (orderId: string | number, currentStatus: string) => {
    setCurrentOrderId(String(orderId));
    setSelectedStatus(currentStatus);
    setIsStatusModalVisible(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalVisible(false);
    setCurrentOrderId(null);
    setSelectedStatus('');
  };

  const handleConfirmStatusUpdate = async () => {
    if (!currentOrderId || !selectedStatus) return;
    
    try {
      await updateOrderStatus(parseInt(currentOrderId, 10), selectedStatus as any);
      alert('订单状态更新成功！');
      handleCloseStatusModal();
      // 重新加载订单数据
      loadOrders();
    } catch (error) {
      console.error('更新订单状态失败:', error);
      alert('订单状态更新失败，请稍后重试');
    }
  };

  const handleExportOrders = () => {
    console.log('导出订单功能需要后端支持');
    alert('导出功能即将上线');
  };

  const handleRefresh = () => {
    loadOrders();
  };

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      navigate('/admin-login');
    }
  };

  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      'pending': '待支付',
      'paid': '已支付',
      'cancelled': '已取消',
      'refunded': '已退款'
    };
    return statusMap[status] || status;
  };

  const getPaymentMethodText = (method: string): string => {
    const methodMap: Record<string, string> = {
      'wechat': '微信支付',
      'alipay': '支付宝支付'
    };
    return methodMap[method] || method;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSortIcon = (field: string): string => {
    if (currentSort.field !== field) {
      return 'fas fa-sort ml-1';
    }
    return `fas fa-sort-${currentSort.direction === 'asc' ? 'up' : 'down'} ml-1`;
  };

  const getPaginationNumbers = () => {
    const totalPages = Math.ceil(totalOrders / pageSize);
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalOrders);
  const totalPages = Math.ceil(totalOrders / pageSize);

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
          
          {/* 中间：面包屑导航 */}
          <div className="flex-1 max-w-md mx-8">
            <nav className="text-sm text-text-secondary">
              <Link to="/admin-dashboard" className="hover:text-primary">管理后台</Link>
              <span className="mx-2">/</span>
              <span className="text-text-primary">订单管理</span>
            </nav>
          </div>
          
          {/* 右侧：管理员操作 */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <i className="fas fa-bell text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
              <img 
                src="https://s.coze.cn/image/hLd5TRtPVD4/" 
                alt="管理员头像" 
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-text-primary hidden md:block">管理员</span>
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
        } lg:translate-x-0 ${styles.sidebarExpanded}`}>
          <div className="h-full overflow-y-auto">
            {/* 管理功能菜单 */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">管理功能</h3>
              <nav className="space-y-1">
                <Link to="/admin-dashboard" className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-tachometer-alt w-5 text-center"></i>
                  <span className="ml-3">数据概览</span>
                </Link>
                <Link to="/product-manage" className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-box w-5 text-center"></i>
                  <span className="ml-3">商品管理</span>
                </Link>
                <Link to="/order-manage" className={`${styles.navLink} ${styles.active} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-receipt w-5 text-center"></i>
                  <span className="ml-3">订单管理</span>
                </Link>
                <Link to="/payment-config" className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-credit-card w-5 text-center"></i>
                  <span className="ml-3">支付配置</span>
                </Link>
                <a href="#" className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-chart-line w-5 text-center"></i>
                  <span className="ml-3">系统监控</span>
                </a>
                <Link to="/security-settings" className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-shield-alt w-5 text-center"></i>
                  <span className="ml-3">安全设置</span>
                </Link>
              </nav>
            </div>
            
            {/* 系统设置 */}
            <div className="p-4 border-t border-border-light">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">系统设置</h3>
              <nav className="space-y-1">
                <a href="#" className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}>
                  <i className="fas fa-user-cog w-5 text-center"></i>
                  <span className="ml-3">个人设置</span>
                </a>
                <button onClick={handleLogout} className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary w-full text-left`}>
                  <i className="fas fa-sign-out-alt w-5 text-center"></i>
                  <span className="ml-3">退出登录</span>
                </button>
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
                <h1 className="text-2xl font-bold text-text-primary">订单管理</h1>
                <p className="text-text-secondary mt-1">管理和处理所有用户订单</p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleExportOrders}
                  className="px-4 py-2 border border-border-light rounded-lg text-sm text-text-primary hover:bg-gray-50 transition-colors"
                >
                  <i className="fas fa-download mr-2"></i>导出订单
                </button>
                <button 
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  <i className="fas fa-sync-alt mr-2"></i>刷新
                </button>
              </div>
            </div>

            {/* 工具栏区域 */}
            <div className="bg-white rounded-xl shadow-card p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 搜索框 */}
                <div>
                  <label htmlFor="search-input" className="block text-sm font-medium text-text-primary mb-2">搜索订单</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="search-input"
                      placeholder="按订单号或用户手机号搜索" 
                      value={currentFilters.search}
                      onChange={(e) => handleSearchChange(e.target.value.trim())}
                      className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchInput}`}
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                  </div>
                </div>
                
                {/* 订单状态筛选 */}
                <div>
                  <label htmlFor="status-filter" className="block text-sm font-medium text-text-primary mb-2">订单状态</label>
                  <select 
                    id="status-filter" 
                    value={currentFilters.status}
                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                    className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">全部状态</option>
                    <option value="pending">待支付</option>
                    <option value="paid">已支付</option>
                    <option value="cancelled">已取消</option>
                    <option value="refunded">已退款</option>
                  </select>
                </div>
                
                {/* 支付方式筛选 */}
                <div>
                  <label htmlFor="payment-filter" className="block text-sm font-medium text-text-primary mb-2">支付方式</label>
                  <select 
                    id="payment-filter" 
                    value={currentFilters.payment}
                    onChange={(e) => handlePaymentFilterChange(e.target.value)}
                    className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">全部方式</option>
                    <option value="wechat">微信支付</option>
                    <option value="alipay">支付宝支付</option>
                  </select>
                </div>
              </div>
              
              {/* 时间范围筛选 */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-text-primary mb-2">下单时间</label>
                <div className="flex space-x-4">
                  <div className="relative">
                    <input 
                      type="date" 
                      value={currentFilters.startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-48 px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <span className="text-text-secondary self-center">至</span>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={currentFilters.endDate}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                      className="w-48 px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <button 
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    清除筛选
                  </button>
                </div>
              </div>
            </div>

            {/* 订单列表 */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              {/* 表格头部 */}
              <div className="px-6 py-4 border-b border-border-light">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">订单列表</h3>
                  <div className="text-sm text-text-secondary">
                    共 <span className="font-medium text-text-primary">{totalOrders}</span> 条订单
                    {isLoading && <span className="ml-2 text-primary">加载中...</span>}
                  </div>
                </div>
              </div>
              
              {/* 表格内容 */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-primary"
                        onClick={() => handleSortChange('order_number')}
                      >
                        订单号 <i className={getSortIcon('order_number')}></i>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-primary"
                        onClick={() => handleSortChange('user')}
                      >
                        用户 <i className={getSortIcon('user')}></i>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-primary"
                        onClick={() => handleSortChange('product')}
                      >
                        商品 <i className={getSortIcon('product')}></i>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-primary"
                        onClick={() => handleSortChange('amount')}
                      >
                        金额 <i className={getSortIcon('amount')}></i>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-primary"
                        onClick={() => handleSortChange('status')}
                      >
                        状态 <i className={getSortIcon('status')}></i>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-primary"
                        onClick={() => handleSortChange('payment_method')}
                      >
                        支付方式 <i className={getSortIcon('payment_method')}></i>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-primary"
                        onClick={() => handleSortChange('created_at')}
                      >
                        下单时间 <i className={getSortIcon('created_at')}></i>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-border-light">
                    {isLoading ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-text-secondary">
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          加载中...
                        </td>
                      </tr>
                    ) : currentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-text-secondary">
                          暂无订单数据
                        </td>
                      </tr>
                    ) : (
                      currentOrders.map(order => (
                      <tr key={order.id} className={`${styles.tableRow} hover:bg-gray-50 transition-colors`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary font-medium">
                          {order.order_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {order.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {order.product}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary font-medium">
                          ¥{order.amount.toLocaleString('zh-CN', {minimumFractionDigits: 2})}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`${styles.statusBadge} ${styles[`status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`]}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {getPaymentMethodText(order.payment_method)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button 
                            onClick={() => handleViewOrderDetail(order.id)}
                            className="text-primary hover:text-blue-600 transition-colors"
                          >
                            <i className="fas fa-eye mr-1"></i>查看
                          </button>
                          <button 
                            onClick={() => handleOpenStatusModal(order.id, order.status)}
                            className="text-text-secondary hover:text-primary transition-colors"
                          >
                            <i className="fas fa-edit mr-1"></i>更新状态
                          </button>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* 分页区域 */}
              <div className="px-6 py-4 border-t border-border-light">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-text-secondary">
                    显示第 <span className="font-medium text-text-primary">{totalOrders > 0 ? startIndex + 1 : 0}</span> 到 <span className="font-medium text-text-primary">{endIndex}</span> 条，共 <span className="font-medium text-text-primary">{totalOrders}</span> 条
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <div className="flex space-x-1">
                      {getPaginationNumbers().map(page => (
                        <button 
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-1 border rounded text-sm ${
                            page === currentPage 
                              ? 'bg-primary text-white border-primary' 
                              : 'border-border-light text-text-secondary hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden ${isSidebarVisible ? 'block' : 'hidden'}`}
        onClick={handleSidebarOverlayClick}
      ></div>
      
      {/* 更新订单状态模态框 */}
      {isStatusModalVisible && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalBackdrop}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`bg-white rounded-xl shadow-xl max-w-md w-full ${styles.modalEnter}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">更新订单状态</h3>
                  <button 
                    onClick={handleCloseStatusModal}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-text-secondary mb-4">请选择新的订单状态：</p>
                  <div className="space-y-3">
                    {[
                      { value: 'pending', text: '待支付' },
                      { value: 'paid', text: '已支付' },
                      { value: 'cancelled', text: '已取消' },
                      { value: 'refunded', text: '已退款' }
                    ].map(status => (
                      <label key={status.value} className="flex items-center">
                        <input 
                          type="radio" 
                          name="new-status" 
                          value={status.value}
                          checked={selectedStatus === status.value}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="ml-3 text-sm text-text-primary">{status.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={handleCloseStatusModal}
                    className="flex-1 px-4 py-2 border border-border-light rounded-lg text-sm text-text-primary hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleConfirmStatusUpdate}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                  >
                    确认更新
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

export default OrderManagePage;

