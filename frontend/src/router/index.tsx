import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import RequireAuth from '../components/RequireAuth';

import P_register from '../pages/p-register';
import P_login from '../pages/p-login';
import P_home from '../pages/p-home';
import P_product_list from '../pages/p-product_list';
import P_product_detail from '../pages/p-product_detail';
import P_checkout from '../pages/p-checkout';
import P_order_confirm from '../pages/p-order_confirm';
import P_order_detail from '../pages/p-order_detail';
import P_user_center from '../pages/p-user_center';
import P_admin_login from '../pages/p-admin_login';
import P_admin_dashboard from '../pages/p-admin_dashboard';
import P_product_manage from '../pages/p-product_manage';
import P_order_manage from '../pages/p-order_manage';
import P_payment_config from '../pages/p-payment_config';
import P_security_settings from '../pages/p-security_settings';
import P_chat_support from '../pages/p-chat_support';
import P_payment from '../pages/p-payment';
import NotFoundPage from './NotFoundPage';
import ErrorPage from './ErrorPage';

function Listener() {
  const location = useLocation();
  useEffect(() => {
    const pageId = 'P-' + location.pathname.replace('/', '').toUpperCase();
    console.log('当前pageId:', pageId, ', pathname:', location.pathname, ', search:', location.search);
    if (typeof window === 'object' && window.parent && window.parent.postMessage) {
      window.parent.postMessage({
        type: 'chux-path-change',
        pageId: pageId,
        pathname: location.pathname,
        search: location.search,
      }, '*');
    }
  }, [location]);

  return <Outlet />;
}

// 使用 createBrowserRouter 创建路由实例
const router = createBrowserRouter([
  {
    path: '/',
    element: <Listener />,
    children: [
      {
    path: '/',
    element: <Navigate to='/home' replace={true} />,
  },
      {
    path: '/register',
    element: (
      <ErrorBoundary>
        <P_register />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/login',
    element: (
      <ErrorBoundary>
        <P_login />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/home',
    element: (
      <ErrorBoundary>
        <P_home />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/product-list',
    element: (
      <ErrorBoundary>
        <P_product_list />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/product-detail',
    element: (
      <ErrorBoundary>
        <P_product_detail />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/chat-support',
    element: (
      <ErrorBoundary>
        <P_chat_support />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/admin-login',
    element: (
      <ErrorBoundary>
        <P_admin_login />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
        // 用户保护路由
        path: '/',
        element: <RequireAuth />,
        children: [
          {
    path: '/checkout',
    element: (
      <ErrorBoundary>
        <P_checkout />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
          {
    path: '/order-confirm',
    element: (
      <ErrorBoundary>
        <P_order_confirm />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
          {
    path: '/order-detail',
    element: (
      <ErrorBoundary>
        <P_order_detail />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
          {
    path: '/user-center',
    element: (
      <ErrorBoundary>
        <P_user_center />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
          {
    path: '/admin-dashboard',
    element: (
      <ErrorBoundary>
        <P_admin_dashboard />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
          {
    path: '/product-manage',
    element: (
      <ErrorBoundary>
        <P_product_manage />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
          {
    path: '/order-manage',
    element: (
      <ErrorBoundary>
        <P_order_manage />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
          {
    path: '/payment-config',
    element: (
      <ErrorBoundary>
        <P_payment_config />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
          {
    path: '/security-settings',
    element: (
      <ErrorBoundary>
        <P_security_settings />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
          {
    path: '/payment/:orderId/:amount',
    element: (
      <ErrorBoundary>
        <P_payment />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
        ]
      },
      {
    path: '*',
    element: <NotFoundPage />,
  },
    ]
  }
]);

export default router;