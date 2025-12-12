

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

const SecuritySettingsPage: React.FC = () => {
  // const _navigate = useNavigate(); // 未使用，暂时注释
  
  // 状态管理
  const [isSidebarCollapsed, _setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [xssProtectionEnabled, setXssProtectionEnabled] = useState(true);
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);
  const [rateLimitQps, setRateLimitQps] = useState(1000);
  const [antiCrawlEnabled, setAntiCrawlEnabled] = useState(false);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '安全设置 - 云商速构';
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
    handleResize(); // 初始化调用

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 事件处理函数
  const handleSidebarToggle = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleSidebarOverlayClick = () => {
    setIsSidebarVisible(false);
  };

  const handleAdminMenuClick = () => {
    console.log('显示管理员菜单');
  };

  const handleNotificationsClick = () => {
    console.log('显示通知列表');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 收集表单数据
    const formData = {
      xssProtection: xssProtectionEnabled,
      rateLimitEnabled: rateLimitEnabled,
      rateLimitQps: rateLimitQps,
      antiCrawlEnabled: antiCrawlEnabled
    };
    
    // 模拟保存操作
    console.log('保存安全设置:', formData);
    
    // 显示成功提示
    setIsSuccessModalVisible(true);
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalVisible(false);
  };

  const handleSuccessModalBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsSuccessModalVisible(false);
    }
  };

  const handleXssProtectionToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setXssProtectionEnabled(e.target.checked);
    console.log('XSS防护状态:', e.target.checked ? '启用' : '禁用');
  };

  const handleRateLimitToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRateLimitEnabled(e.target.checked);
    console.log('限流功能状态:', e.target.checked ? '启用' : '禁用');
  };

  const handleAntiCrawlToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAntiCrawlEnabled(e.target.checked);
    console.log('防爬机制状态:', e.target.checked ? '启用' : '禁用');
  };

  const handleRateLimitQpsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value);
    if (value < 1) {
      value = 1;
    } else if (value > 10000) {
      value = 10000;
    }
    setRateLimitQps(value);
    console.log('QPS限制值:', value);
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
              <span className="text-xl font-bold text-text-primary">云商速构</span>
            </div>
          </div>
          
          {/* 右侧：管理员操作 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleNotificationsClick}
              className="relative p-2 rounded-lg hover:bg-gray-100"
            >
              <i className="fas fa-bell text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full"></span>
            </button>
            <div 
              onClick={handleAdminMenuClick}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
            >
              <img 
                src="https://s.coze.cn/image/cX3iA9UfNnw/" 
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
          isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded
        } ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="h-full overflow-y-auto">
            {/* 管理功能 */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">管理功能</h3>
              <nav className="space-y-1">
                <Link 
                  to="/admin-dashboard" 
                  className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}
                >
                  <i className="fas fa-tachometer-alt w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>仪表盘</span>
                </Link>
                <Link 
                  to="/product-manage" 
                  className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}
                >
                  <i className="fas fa-box w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>商品管理</span>
                </Link>
                <Link 
                  to="/order-manage" 
                  className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}
                >
                  <i className="fas fa-receipt w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>订单管理</span>
                </Link>
                <Link 
                  to="/payment-config" 
                  className={`${styles.navLink} flex items-center px-3 py-2 rounded-lg text-sm text-text-primary`}
                >
                  <i className="fas fa-credit-card w-5 text-center"></i>
                  <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>支付配置</span>
                </Link>
                <Link 
                  to="/security-settings" 
                  className={`${styles.navLink} ${styles.active} flex items-center px-3 py-2 rounded-lg text-sm text-primary`}
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
                  <h1 className="text-3xl font-bold text-text-primary mb-2">安全设置</h1>
                  <nav className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Link to="/admin-dashboard" className="hover:text-primary">管理后台</Link>
                    <i className="fas fa-chevron-right text-xs"></i>
                    <span className="text-text-primary">安全设置</span>
                  </nav>
                </div>
              </div>
            </div>

            {/* 安全设置表单 */}
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* HTTPS配置状态 */}
              <div className={`${styles.settingCard} bg-white rounded-xl shadow-card p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">HTTPS配置</h3>
                    <p className="text-text-secondary text-sm">强制使用HTTPS协议，保障数据传输安全</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`${styles.statusBadge} ${styles.statusEnabled}`}>
                      <i className="fas fa-check-circle mr-1"></i>
                      已启用
                    </span>
                    <span className="text-text-secondary text-sm">系统默认</span>
                  </div>
                </div>
              </div>

              {/* XSS防护 */}
              <div className={`${styles.settingCard} bg-white rounded-xl shadow-card p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">XSS防护</h3>
                    <p className="text-text-secondary text-sm">前端输入过滤、后端输出编码，防止跨站脚本攻击</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={xssProtectionEnabled}
                      onChange={handleXssProtectionToggle}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>

              {/* 限流配置 */}
              <div className={`${styles.settingCard} bg-white rounded-xl shadow-card p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">限流配置</h3>
                    <p className="text-text-secondary text-sm">对API接口进行限流，防止恶意请求和DoS攻击</p>
                    <div className="mt-4">
                      <label htmlFor="rate-limit-qps" className="block text-sm font-medium text-text-primary mb-2">QPS限制</label>
                      <div className="flex items-center space-x-3">
                        <input 
                          type="number" 
                          id="rate-limit-qps" 
                          name="rate-limit-qps"
                          value={rateLimitQps} 
                          min="1" 
                          max="10000"
                          disabled={!rateLimitEnabled}
                          onChange={handleRateLimitQpsChange}
                          className={`w-32 px-3 py-2 border border-border-light rounded-lg ${styles.inputFocus} ${!rateLimitEnabled ? 'opacity-50' : ''}`}
                        />
                        <span className="text-text-secondary text-sm">请求/秒</span>
                      </div>
                    </div>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={rateLimitEnabled}
                      onChange={handleRateLimitToggle}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>

              {/* 防爬机制 */}
              <div className={`${styles.settingCard} bg-white rounded-xl shadow-card p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">防爬机制</h3>
                    <p className="text-text-secondary text-sm">对敏感数据接口和高频访问接口实施防爬虫策略</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={antiCrawlEnabled}
                      onChange={handleAntiCrawlToggle}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>

              {/* 数据加密状态 */}
              <div className={`${styles.settingCard} bg-white rounded-xl shadow-card p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">数据加密</h3>
                    <p className="text-text-secondary text-sm">敏感数据（如用户密码、支付密钥）进行加密存储</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`${styles.statusBadge} ${styles.statusEnabled}`}>
                      <i className="fas fa-lock mr-1"></i>
                      已启用
                    </span>
                    <span className="text-text-secondary text-sm">系统默认</span>
                  </div>
                </div>
              </div>

              {/* 权限控制状态 */}
              <div className={`${styles.settingCard} bg-white rounded-xl shadow-card p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">权限控制</h3>
                    <p className="text-text-secondary text-sm">严格的前后端权限校验，防止未授权访问</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`${styles.statusBadge} ${styles.statusEnabled}`}>
                      <i className="fas fa-user-shield mr-1"></i>
                      已启用
                    </span>
                    <span className="text-text-secondary text-sm">系统默认</span>
                  </div>
                </div>
              </div>

              {/* 保存按钮 */}
              <div className="flex justify-end pt-6">
                <button 
                  type="submit" 
                  className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <i className="fas fa-save"></i>
                  <span>保存设置</span>
                </button>
              </div>
            </form>

            {/* 安全提示 */}
            <div className="mt-8 bg-blue-50 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <i className="fas fa-info-circle text-info text-xl mt-1"></i>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">安全提示</h3>
                  <ul className="space-y-2 text-text-secondary text-sm">
                    <li className="flex items-start space-x-2">
                      <i className="fas fa-check text-success text-xs mt-1.5"></i>
                      <span>建议保持HTTPS、XSS防护、数据加密和权限控制功能启用</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="fas fa-check text-success text-xs mt-1.5"></i>
                      <span>限流QPS值应根据实际业务需求调整，避免设置过低影响正常访问</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="fas fa-check text-success text-xs mt-1.5"></i>
                      <span>防爬机制可能会影响搜索引擎抓取，启用前请确认业务需求</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="fas fa-check text-success text-xs mt-1.5"></i>
                      <span>修改安全设置后请及时测试系统功能是否正常</span>
                    </li>
                  </ul>
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

      {/* 成功提示模态框 */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isSuccessModalVisible ? 'flex' : 'hidden'} items-center justify-center`}
        onClick={handleSuccessModalBackgroundClick}
      >
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-success text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">设置保存成功</h3>
            <p className="text-text-secondary text-sm mb-6">您的安全设置已成功保存，部分设置可能需要重启服务后生效</p>
            <button 
              onClick={handleSuccessModalClose}
              className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsPage;

