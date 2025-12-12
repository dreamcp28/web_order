import apiClient from './client';

// 订单接口类型定义
export interface Order {
  id: number;
  order_number: string;
  user: string;
  user_id: number;
  product: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  payment_method: 'wechat' | 'alipay';
  created_at: string;
  items?: Array<{
    id: number;
    product_name: string;
    product_price: number;
    quantity: number;
  }>;
}

export interface OrderDetail extends Order {
  shipping_address?: string;
  remark?: string;
  updated_at: string;
  payments?: Array<{
    id: number;
    transaction_id: string;
    amount: number;
    status: string;
    payment_method: string;
    created_at: string;
  }>;
}

export interface OrderListResponse {
  orders: Order[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 获取订单列表
export const getOrders = async (params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  payment_method?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  userId?: number;
}): Promise<OrderListResponse> => {
  try {
    const response = await apiClient.get('/orders', { params });
    return response.data as OrderListResponse;
  } catch (error) {
    console.error('获取订单列表失败:', error);
    throw error;
  }
};

// 获取订单详情
export const getOrderDetail = async (orderId: number): Promise<OrderDetail> => {
  try {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data as OrderDetail;
  } catch (error) {
    console.error('获取订单详情失败:', error);
    throw error;
  }
};

// 更新订单状态（管理员）
export const updateOrderStatus = async (
  orderId: number,
  status: 'pending' | 'paid' | 'cancelled' | 'refunded'
): Promise<void> => {
  try {
    await apiClient.put(`/orders/${orderId}/status`, { status });
  } catch (error) {
    console.error('更新订单状态失败:', error);
    throw error;
  }
};

export default {
  getOrders,
  getOrderDetail,
  updateOrderStatus
};

