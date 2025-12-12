import client from './client';

// 支付API客户端
export const paymentApi = {
  // 创建支付订单
  createPayment: async (orderId: string, amount: number, method: 'wechat' | 'alipay') => {
    const response = await client.post('/api/payment', {
      orderId,
      amount,
      method
    });
    return response.data;
  },

  // 查询支付记录
  getPayment: async (transactionId: string) => {
    const response = await client.get(`/api/payment/${transactionId}`);
    return response.data;
  },

  // 查询订单的支付记录
  getOrderPayments: async (orderId: string) => {
    const response = await client.get(`/api/payment/order/${orderId}`);
    return response.data;
  },

  // 查询支付结果
  getPaymentResult: async (transactionId: string) => {
    const response = await client.get(`/api/payment/result/${transactionId}`);
    return response.data;
  },

  // 模拟支付成功（仅用于测试）
  simulatePaymentSuccess: async (transactionId: string) => {
    const response = await client.post(`/api/payment/test/success`, {
      transactionId
    });
    return response.data;
  },

  // 模拟支付失败（仅用于测试）
  simulatePaymentFailed: async (transactionId: string) => {
    const response = await client.post(`/api/payment/test/failed`, {
      transactionId
    });
    return response.data;
  }
};
