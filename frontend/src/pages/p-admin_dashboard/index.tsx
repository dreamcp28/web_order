

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, _setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '管理后台 - 云商速构';
    return () => { document.title = originalTitle; };
  }, []);

  // 移除未使用的侧边栏切换函数
  // const _handleSidebarToggle = () => {
  //   setIsSidebarCollapsed(!isSidebarCollapsed);
  // };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileOverlayClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      navigate('/admin-login');
    }
  };

  const handleNotificationsClick = () => {
    alert('您有3条新通知：\n1. 3个订单待处理退款\n2. 商品库存不足提醒\n3. 系统更新可用');
  };

  const handleQuickAddProduct = () => {
    navigate('/product-manage?action=add');
  };

  const handleQuickViewOrders = () => {
    navigate('/order-manage?status=pending');
  };

  const handleQuickPaymentConfig = () => {
    navigate('/payment-config');
  };

  const handleQuickSystemMonitor = () => {
    navigate('/admin-dashboard');
  };

  const handleTodo1Action = () => {
    navigate('/order-manage?status=refund');
  };

  const handleTodo2Action = () => {
    navigate('/product-manage?filter=low_stock');
  };

  const handleTodo3Action = () => {
    navigate('/admin-dashboard');
  };

  const handleOrderDetail = (orderId: string) => {
    navigate(`/order-detail?id=${orderId}`);
  };

  const handleViewAllOrders = () => {
    navigate('/order-manage');
  };

  const handleAdminMenuClick = () => {
    console.log('查看管理员信息');
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* 左侧：Logo和菜单切换 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleMobileMenuToggle}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <i className="fas fa-bars text-gray-600"></i>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-cloud text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold text-text-primary">云商速构 - 管理后台</span>
            </div>
          </div>
          
          {/* 右侧：管理员操作 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleNotificationsClick}
              className="relative p-2 rounded-lg hover:bg-gray-100"
            >
              <i className="fas fa-bell text-gray-600"></i>
              <span className={`absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center ${styles.notificationBadge}`}>
                3
              </span>
            </button>
            <div 
              onClick={handleAdminMenuClick}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
            >
              <img 
                src="https://s.coze.cn/image/xISp3FCbmxc/" 
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
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded
        }`}>
          <div className="h-full overflow-y-auto">
            {/* 管理功能菜单 */}
            <div className="p-4">
              <nav className="space-y-1">
                <Link 
                  to="/admin-dashboard" 
                  className={`${styles.navLink} ${styles.navLinkActive} flex items-center px-3 py-3 rounded-lg text-sm text-text-primary`}
                >
                  <i className="fas fa-tachometer-alt w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>控制台</span>
                </Link>
                <Link 
                  to="/product-manage" 
                  className={`${styles.navLink} flex items-center px-3 py-3 rounded-lg text-sm text-text-primary`}
                >
                  <i className="fas fa-box w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>商品管理</span>
                </Link>
                <Link 
                  to="/order-manage" 
                  className={`${styles.navLink} flex items-center px-3 py-3 rounded-lg text-sm text-text-primary`}
                >
                  <i className="fas fa-receipt w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>订单管理</span>
                </Link>
                <Link 
                  to="/payment-config" 
                  className={`${styles.navLink} flex items-center px-3 py-3 rounded-lg text-sm text-text-primary`}
                >
                  <i className="fas fa-credit-card w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>支付配置</span>
                </Link>
                <Link 
                  to="/admin-dashboard" 
                  className={`${styles.navLink} flex items-center px-3 py-3 rounded-lg text-sm text-text-primary`}
                >
                  <i className="fas fa-chart-line w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>系统监控</span>
                </Link>
                <Link 
                  to="/security-settings" 
                  className={`${styles.navLink} flex items-center px-3 py-3 rounded-lg text-sm text-text-primary`}
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
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary mb-2">控制台概览</h1>
                  <nav className="text-sm text-text-secondary">
                    <span>管理后台</span>
                    <i className="fas fa-chevron-right mx-2"></i>
                    <span className="text-primary">控制台</span>
                  </nav>
                </div>
                <div className="text-right">
                  <p className="text-text-secondary">欢迎回来，管理员</p>
                  <p className="text-sm text-text-secondary">今天是 2024年1月15日</p>
                </div>
              </div>
            </div>

            {/* 数据概览卡片 */}
            <section className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 总销售额 */}
                <div className={`${styles.statCard} bg-white rounded-xl shadow-card p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-secondary text-sm mb-1">总销售额</p>
                      <p className="text-3xl font-bold text-text-primary">¥156,890</p>
                      <p className="text-success text-sm mt-2">
                        <i className="fas fa-arrow-up mr-1"></i>
                        较上月 +12.5%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-dollar-sign text-primary text-xl"></i>
                    </div>
                  </div>
                </div>

                {/* 订单总数 */}
                <div className={`${styles.statCard} bg-white rounded-xl shadow-card p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-secondary text-sm mb-1">订单总数</p>
                      <p className="text-3xl font-bold text-text-primary">1,247</p>
                      <p className="text-success text-sm mt-2">
                        <i className="fas fa-arrow-up mr-1"></i>
                        较上月 +8.3%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-shopping-cart text-warning text-xl"></i>
                    </div>
                  </div>
                </div>

                {/* 待处理订单 */}
                <div className={`${styles.statCard} bg-white rounded-xl shadow-card p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-secondary text-sm mb-1">待处理订单</p>
                      <p className="text-3xl font-bold text-text-primary">15</p>
                      <p className="text-danger text-sm mt-2">
                        <i className="fas fa-exclamation-triangle mr-1"></i>
                        需要处理
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-danger bg-opacity-10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-clock text-danger text-xl"></i>
                    </div>
                  </div>
                </div>

                {/* 活跃用户 */}
                <div className={`${styles.statCard} bg-white rounded-xl shadow-card p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-secondary text-sm mb-1">活跃用户</p>
                      <p className="text-3xl font-bold text-text-primary">892</p>
                      <p className="text-success text-sm mt-2">
                        <i className="fas fa-arrow-up mr-1"></i>
                        较上月 +15.2%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-users text-success text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 快速操作和系统状态 */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* 快速操作 */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">快速操作</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleQuickAddProduct}
                    className="bg-primary text-white p-4 rounded-lg hover:bg-blue-600 transition-colors text-left"
                  >
                    <i className="fas fa-plus-circle text-2xl mb-2"></i>
                    <p className="font-medium">新增商品</p>
                    <p className="text-sm opacity-90">添加新的商品到系统</p>
                  </button>
                  <button 
                    onClick={handleQuickViewOrders}
                    className="bg-warning text-white p-4 rounded-lg hover:bg-yellow-600 transition-colors text-left"
                  >
                    <i className="fas fa-eye text-2xl mb-2"></i>
                    <p className="font-medium">查看订单</p>
                    <p className="text-sm opacity-90">管理所有订单</p>
                  </button>
                  <button 
                    onClick={handleQuickPaymentConfig}
                    className="bg-info text-white p-4 rounded-lg hover:bg-cyan-600 transition-colors text-left"
                  >
                    <i className="fas fa-cog text-2xl mb-2"></i>
                    <p className="font-medium">支付配置</p>
                    <p className="text-sm opacity-90">设置支付参数</p>
                  </button>
                  <button 
                    onClick={handleQuickSystemMonitor}
                    className="bg-success text-white p-4 rounded-lg hover:bg-green-600 transition-colors text-left"
                  >
                    <i className="fas fa-chart-bar text-2xl mb-2"></i>
                    <p className="font-medium">系统监控</p>
                    <p className="text-sm opacity-90">查看系统状态</p>
                  </button>
                </div>
              </div>

              {/* 系统状态 */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">系统状态</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="fas fa-microchip text-primary mr-3"></i>
                      <span className="text-text-primary">CPU使用率</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className={`${styles.progressBar} h-2 rounded-full`} style={{width: '65%'}}></div>
                      </div>
                      <span className="text-sm text-text-secondary">65%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="fas fa-memory text-warning mr-3"></i>
                      <span className="text-text-primary">内存使用率</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className={`${styles.progressBar} h-2 rounded-full`} style={{width: '42%'}}></div>
                      </div>
                      <span className="text-sm text-text-secondary">42%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="fas fa-hdd text-success mr-3"></i>
                      <span className="text-text-primary">磁盘使用率</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className={`${styles.progressBar} h-2 rounded-full`} style={{width: '28%'}}></div>
                      </div>
                      <span className="text-sm text-text-secondary">28%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="fas fa-server text-info mr-3"></i>
                      <span className="text-text-primary">服务状态</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 bg-success rounded-full"></span>
                      <span className="text-sm text-success">正常运行</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 待办事项和最近订单 */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* 待办事项 */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">待办事项</h3>
                  <span className="bg-danger text-white text-xs px-2 py-1 rounded-full">3</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-red-50 rounded-lg border-l-4 border-danger">
                    <i className="fas fa-exclamation-triangle text-danger mr-3"></i>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">3个订单待处理退款</p>
                      <p className="text-sm text-text-secondary">需要在24小时内处理</p>
                    </div>
                    <button 
                      onClick={handleTodo1Action}
                      className="text-danger hover:text-red-700"
                    >
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                  <div className="flex items-center p-3 bg-yellow-50 rounded-lg border-l-4 border-warning">
                    <i className="fas fa-clock text-warning mr-3"></i>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">商品库存不足提醒</p>
                      <p className="text-sm text-text-secondary">5个商品库存低于预警值</p>
                    </div>
                    <button 
                      onClick={handleTodo2Action}
                      className="text-warning hover:text-yellow-700"
                    >
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg border-l-4 border-info">
                    <i className="fas fa-info-circle text-info mr-3"></i>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">系统更新可用</p>
                      <p className="text-sm text-text-secondary">v2.1.0 版本更新</p>
                    </div>
                    <button 
                      onClick={handleTodo3Action}
                      className="text-info hover:text-blue-700"
                    >
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* 最近订单 */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">最近订单</h3>
                  <button 
                    onClick={handleViewAllOrders}
                    className="text-primary hover:text-blue-700 text-sm"
                  >
                    查看全部
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-light">
                        <th className="text-left py-3 px-2 text-sm font-medium text-text-secondary">订单号</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-text-secondary">商品</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-text-secondary">金额</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-text-secondary">状态</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-text-secondary">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={`${styles.orderRow} border-b border-border-light`}>
                        <td className="py-3 px-2 text-sm text-text-primary">#20240115001</td>
                        <td className="py-3 px-2 text-sm text-text-primary">电商系统基础版</td>
                        <td className="py-3 px-2 text-sm text-text-primary">¥2,999</td>
                        <td className="py-3 px-2">
                          <span className="bg-success bg-opacity-10 text-success text-xs px-2 py-1 rounded-full">已支付</span>
                        </td>
                        <td className="py-3 px-2">
                          <button 
                            onClick={() => handleOrderDetail('20240115001')}
                            className="text-primary hover:text-blue-700 text-sm"
                          >
                            查看
                          </button>
                        </td>
                      </tr>
                      <tr className={`${styles.orderRow} border-b border-border-light`}>
                        <td className="py-3 px-2 text-sm text-text-primary">#20240115002</td>
                        <td className="py-3 px-2 text-sm text-text-primary">智能客服系统</td>
                        <td className="py-3 px-2 text-sm text-text-primary">¥1,599</td>
                        <td className="py-3 px-2">
                          <span className="bg-warning bg-opacity-10 text-warning text-xs px-2 py-1 rounded-full">待支付</span>
                        </td>
                        <td className="py-3 px-2">
                          <button 
                            onClick={() => handleOrderDetail('20240115002')}
                            className="text-primary hover:text-blue-700 text-sm"
                          >
                            查看
                          </button>
                        </td>
                      </tr>
                      <tr className={`${styles.orderRow} border-b border-border-light`}>
                        <td className="py-3 px-2 text-sm text-text-primary">#20240115003</td>
                        <td className="py-3 px-2 text-sm text-text-primary">企业级电商平台</td>
                        <td className="py-3 px-2 text-sm text-text-primary">¥8,999</td>
                        <td className="py-3 px-2">
                          <span className="bg-success bg-opacity-10 text-success text-xs px-2 py-1 rounded-full">已支付</span>
                        </td>
                        <td className="py-3 px-2">
                          <button 
                            onClick={() => handleOrderDetail('20240115003')}
                            className="text-primary hover:text-blue-700 text-sm"
                          >
                            查看
                          </button>
                        </td>
                      </tr>
                      <tr className={`${styles.orderRow} border-b border-border-light`}>
                        <td className="py-3 px-2 text-sm text-text-primary">#20240115004</td>
                        <td className="py-3 px-2 text-sm text-text-primary">DevOps自动化部署</td>
                        <td className="py-3 px-2 text-sm text-text-primary">¥3,999</td>
                        <td className="py-3 px-2">
                          <span className="bg-info bg-opacity-10 text-info text-xs px-2 py-1 rounded-full">处理中</span>
                        </td>
                        <td className="py-3 px-2">
                          <button 
                            onClick={() => handleOrderDetail('20240115004')}
                            className="text-primary hover:text-blue-700 text-sm"
                          >
                            查看
                          </button>
                        </td>
                      </tr>
                      <tr className={styles.orderRow}>
                        <td className="py-3 px-2 text-sm text-text-primary">#20240115005</td>
                        <td className="py-3 px-2 text-sm text-text-primary">移动端商城</td>
                        <td className="py-3 px-2 text-sm text-text-primary">¥4,599</td>
                        <td className="py-3 px-2">
                          <span className="bg-success bg-opacity-10 text-success text-xs px-2 py-1 rounded-full">已支付</span>
                        </td>
                        <td className="py-3 px-2">
                          <button 
                            onClick={() => handleOrderDetail('20240115005')}
                            className="text-primary hover:text-blue-700 text-sm"
                          >
                            查看
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* 侧边栏遮罩（移动端） */}
      {isMobileMenuOpen && (
        <div 
          onClick={handleMobileOverlayClick}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        ></div>
      )}
    </div>
  );
};

export default AdminDashboard;

