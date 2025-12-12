

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

const ChatSupportPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, _setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [messageInputValue, setMessageInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: '您好！我是云商速构的智能客服助手，很高兴为您服务。请问有什么可以帮助您的吗？',
      sender: 'ai',
      timestamp: '刚刚'
    }
  ]);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '智能客服 - 云商速构';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 移除未使用的侧边栏切换函数
  // const _handleSidebarToggle = () => {
  //   setIsSidebarCollapsed(!isSidebarCollapsed);
  // };

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarVisible(!isMobileSidebarVisible);
  };

  const handleSearchInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const handleQuickOrderClick = () => {
    navigate('/user-center');
  };

  const handleQuickHelpClick = () => {
    navigate('/help-center');
  };

  const handleUserMenuClick = () => {
    navigate('/user-center');
  };

  const adjustTextareaHeight = () => {
    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
      messageInputRef.current.style.height = Math.min(messageInputRef.current.scrollHeight, 120) + 'px';
    }
  };

  const generateAIReply = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('购买') || message.includes('买')) {
      return '您可以在商品详情页点击"立即购买"按钮，然后按照提示完成支付流程。如需帮助，请告诉我具体是哪个商品。';
    } else if (message.includes('支付') || message.includes('付款')) {
      return '我们支持微信支付和支付宝支付两种方式。在结算页面您可以选择任意一种支付方式完成付款。';
    } else if (message.includes('订单') || message.includes('状态')) {
      return '您可以在"个人中心" -> "我的订单"中查看所有订单的状态和详情。如有异常订单，建议您联系人工客服处理。';
    } else if (message.includes('退款') || message.includes('退货')) {
      return '虚拟商品购买后不支持退款，如有特殊情况请联系人工客服处理。实体商品退款政策请查看购买页面说明。';
    } else if (message.includes('部署') || message.includes('安装')) {
      return '系统部署有详细的教程文档，您可以在购买后获取。如果遇到技术问题，我们提供7x24小时技术支持服务。';
    } else if (message.includes('客服') || message.includes('人工')) {
      return '工作时间内您可以直接联系人工客服，非工作时间请留言，我们会在24小时内回复您。客服热线：400-123-4567。';
    } else if (message.includes('时间') || message.includes('服务')) {
      return '我们的技术支持时间是工作日9:00-18:00，智能客服7x24小时在线。紧急问题请拨打客服热线。';
    } else {
      return '感谢您的咨询！我已经记录了您的问题，正在为您转接人工客服，请稍候...';
    }
  };

  const addMessageToChat = (text: string, sender: 'user' | 'ai') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: '刚刚'
    };

    setChatMessages(prevMessages => [...prevMessages, newMessage]);

    // 滚动到底部
    setTimeout(() => {
      if (chatMessagesContainerRef.current) {
        chatMessagesContainerRef.current.scrollTop = chatMessagesContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    // 添加用户消息
    addMessageToChat(text, 'user');
    
    // 清空输入框
    setMessageInputValue('');
    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
      messageInputRef.current.blur();
    }
    
    // 模拟AI回复
    setTimeout(() => {
      const reply = generateAIReply(text);
      addMessageToChat(reply, 'ai');
    }, 1000);
  };

  const handleSendButtonClick = () => {
    sendMessage(messageInputValue);
  };

  const handleMessageInputKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(messageInputValue);
    }
  };

  const handleQuickQuestionClick = (question: string) => {
    setMessageInputValue(question);
    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
      messageInputRef.current.style.height = Math.min(messageInputRef.current.scrollHeight, 120) + 'px';
      messageInputRef.current.focus();
    }
  };

  const handleKeywordClick = (keyword: string) => {
    setMessageInputValue(`关于${keyword}的问题`);
    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
      messageInputRef.current.style.height = Math.min(messageInputRef.current.scrollHeight, 120) + 'px';
      messageInputRef.current.focus();
    }
  };

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
                onKeyPress={handleSearchInputKeyPress}
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
            <div 
              onClick={handleUserMenuClick}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
            >
              <img 
                src="https://s.coze.cn/image/JOI2tN7QhN8/" 
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
          isMobileSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded
        }`}>
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
                <button 
                  onClick={handleQuickOrderClick}
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
            {/* 页面头部 */}
            <div className="mb-6">
              {/* 面包屑导航 */}
              <nav className="mb-4">
                <ol className="flex items-center space-x-2 text-sm text-text-secondary">
                  <li>
                    <Link to="/home" className="hover:text-primary">首页</Link>
                  </li>
                  <li>
                    <i className="fas fa-chevron-right text-xs"></i>
                  </li>
                  <li>
                    <Link to="/user-center" className="hover:text-primary">个人中心</Link>
                  </li>
                  <li>
                    <i className="fas fa-chevron-right text-xs"></i>
                  </li>
                  <li className="text-text-primary">智能客服</li>
                </ol>
              </nav>
              
              {/* 页面标题 */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text-primary">智能客服</h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-success font-medium">在线服务</span>
                </div>
              </div>
            </div>

            {/* 聊天区域 */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              {/* 聊天头部 */}
              <div className="bg-primary text-white p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <i className="fas fa-robot text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold">智能客服助手</h3>
                    <p className="text-sm opacity-90">工作日 9:00-18:00 在线</p>
                  </div>
                </div>
              </div>

              {/* 聊天内容区域 */}
              <div className="flex h-96">
                {/* 聊天记录 */}
                <div className="flex-1 flex flex-col">
                  <div 
                    ref={chatMessagesContainerRef}
                    className={`flex-1 p-4 space-y-4 overflow-y-auto ${styles.chatContainer}`}
                  >
                    {chatMessages.map((message) => (
                      <div key={message.id} className={styles.chatMessage}>
                        {message.sender === 'user' ? (
                          <div className="flex items-start space-x-3 justify-end">
                            <div className="flex-1 max-w-md">
                              <div className="bg-primary text-white rounded-lg rounded-tr-md px-4 py-2 ml-auto">
                                <p className="text-sm">{message.text}</p>
                              </div>
                              <span className="text-xs text-text-secondary mr-2 mt-1 block text-right">{message.timestamp}</span>
                            </div>
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                              <i className="fas fa-user text-gray-600 text-sm"></i>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <i className="fas fa-robot text-white text-sm"></i>
                            </div>
                            <div className="flex-1 max-w-md">
                              <div className="bg-gray-100 rounded-lg rounded-tl-md px-4 py-2">
                                <p className="text-sm text-text-primary">{message.text}</p>
                              </div>
                              <span className="text-xs text-text-secondary ml-2 mt-1 block">{message.timestamp}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 输入区域 */}
                  <div className="border-t border-border-light p-4">
                    <div className="flex space-x-3">
                      <div className="flex-1 relative">
                        <textarea 
                          ref={messageInputRef}
                          value={messageInputValue}
                          onChange={(e) => {
                            setMessageInputValue(e.target.value);
                            adjustTextareaHeight();
                          }}
                          onKeyPress={handleMessageInputKeyPress}
                          placeholder="请输入您的问题..."
                          className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.messageInput} resize-none`}
                          rows={1}
                          style={{ minHeight: '44px', maxHeight: '120px' }}
                        />
                      </div>
                      <button 
                        onClick={handleSendButtonClick}
                        className="bg-primary text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0"
                      >
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 常见问题侧边栏 */}
                <div className="w-64 border-l border-border-light bg-gray-50 p-4 hidden xl:block">
                  <h3 className="font-semibold text-text-primary mb-4">常见问题</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleQuickQuestionClick('如何购买商品？')}
                      className={`${styles.quickQuestion} w-full text-left px-3 py-2 rounded-lg text-sm transition-colors`}
                    >
                      <i className="fas fa-shopping-cart text-primary mr-2"></i>
                      如何购买商品？
                    </button>
                    <button 
                      onClick={() => handleQuickQuestionClick('支付方式有哪些？')}
                      className={`${styles.quickQuestion} w-full text-left px-3 py-2 rounded-lg text-sm transition-colors`}
                    >
                      <i className="fas fa-credit-card text-primary mr-2"></i>
                      支付方式有哪些？
                    </button>
                    <button 
                      onClick={() => handleQuickQuestionClick('如何查看订单状态？')}
                      className={`${styles.quickQuestion} w-full text-left px-3 py-2 rounded-lg text-sm transition-colors`}
                    >
                      <i className="fas fa-receipt text-primary mr-2"></i>
                      如何查看订单状态？
                    </button>
                    <button 
                      onClick={() => handleQuickQuestionClick('商品如何退款？')}
                      className={`${styles.quickQuestion} w-full text-left px-3 py-2 rounded-lg text-sm transition-colors`}
                    >
                      <i className="fas fa-undo text-primary mr-2"></i>
                      商品如何退款？
                    </button>
                    <button 
                      onClick={() => handleQuickQuestionClick('技术支持时间？')}
                      className={`${styles.quickQuestion} w-full text-left px-3 py-2 rounded-lg text-sm transition-colors`}
                    >
                      <i className="fas fa-clock text-primary mr-2"></i>
                      技术支持时间？
                    </button>
                    <button 
                      onClick={() => handleQuickQuestionClick('系统部署教程？')}
                      className={`${styles.quickQuestion} w-full text-left px-3 py-2 rounded-lg text-sm transition-colors`}
                    >
                      <i className="fas fa-rocket text-primary mr-2"></i>
                      系统部署教程？
                    </button>
                    <button 
                      onClick={() => handleQuickQuestionClick('如何联系人工客服？')}
                      className={`${styles.quickQuestion} w-full text-left px-3 py-2 rounded-lg text-sm transition-colors`}
                    >
                      <i className="fas fa-headset text-primary mr-2"></i>
                      如何联系人工客服？
                    </button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border-light">
                    <h4 className="font-medium text-text-primary mb-3">关键词提示</h4>
                    <div className="flex flex-wrap gap-2">
                      <span 
                        onClick={() => handleKeywordClick('购买')}
                        className="bg-primary bg-opacity-10 text-primary text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-opacity-20 transition-colors"
                      >
                        购买
                      </span>
                      <span 
                        onClick={() => handleKeywordClick('支付')}
                        className="bg-primary bg-opacity-10 text-primary text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-opacity-20 transition-colors"
                      >
                        支付
                      </span>
                      <span 
                        onClick={() => handleKeywordClick('订单')}
                        className="bg-primary bg-opacity-10 text-primary text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-opacity-20 transition-colors"
                      >
                        订单
                      </span>
                      <span 
                        onClick={() => handleKeywordClick('退款')}
                        className="bg-primary bg-opacity-10 text-primary text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-opacity-20 transition-colors"
                      >
                        退款
                      </span>
                      <span 
                        onClick={() => handleKeywordClick('部署')}
                        className="bg-primary bg-opacity-10 text-primary text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-opacity-20 transition-colors"
                      >
                        部署
                      </span>
                      <span 
                        onClick={() => handleKeywordClick('客服')}
                        className="bg-primary bg-opacity-10 text-primary text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-opacity-20 transition-colors"
                      >
                        客服
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 移动端常见问题 */}
            <div className="mt-6 xl:hidden">
              <div className="bg-white rounded-xl shadow-card p-4">
                <h3 className="font-semibold text-text-primary mb-4">常见问题</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleQuickQuestionClick('如何购买商品？')}
                    className={`${styles.quickQuestion} px-3 py-2 rounded-lg text-sm transition-colors border border-border-light`}
                  >
                    <i className="fas fa-shopping-cart text-primary mr-2"></i>
                    购买商品
                  </button>
                  <button 
                    onClick={() => handleQuickQuestionClick('支付方式有哪些？')}
                    className={`${styles.quickQuestion} px-3 py-2 rounded-lg text-sm transition-colors border border-border-light`}
                  >
                    <i className="fas fa-credit-card text-primary mr-2"></i>
                    支付方式
                  </button>
                  <button 
                    onClick={() => handleQuickQuestionClick('如何查看订单状态？')}
                    className={`${styles.quickQuestion} px-3 py-2 rounded-lg text-sm transition-colors border border-border-light`}
                  >
                    <i className="fas fa-receipt text-primary mr-2"></i>
                    订单状态
                  </button>
                  <button 
                    onClick={() => handleQuickQuestionClick('商品如何退款？')}
                    className={`${styles.quickQuestion} px-3 py-2 rounded-lg text-sm transition-colors border border-border-light`}
                  >
                    <i className="fas fa-undo text-primary mr-2"></i>
                    退款流程
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 侧边栏遮罩（移动端） */}
      {isMobileSidebarVisible && (
        <div 
          onClick={handleMobileSidebarToggle}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        ></div>
      )}
    </div>
  );
};

export default ChatSupportPage;

