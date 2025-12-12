import { AppDataSource } from '../config/database';
import { Payment } from '../models/Payment';
import { Order } from '../models/Order';
import { env } from '../config/env';

// 支付服务类
export class PaymentService {
  private paymentRepository = AppDataSource.getRepository(Payment);
  private orderRepository = AppDataSource.getRepository(Order);

  // 创建支付订单
  async createPayment(
    orderId: number,
    amount: number,
    method: 'wechat' | 'alipay',
    userId: number
  ): Promise<Payment> {
    // 验证订单是否存在
    const order = await this.orderRepository.findOneBy({ id: orderId, user_id: userId });
    if (!order) {
      throw new Error('订单不存在或无权访问');
    }

    // 生成唯一的交易ID
    const transactionId = `${method}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 创建支付记录
    const payment = this.paymentRepository.create({
      order,
      order_id: orderId,
      transaction_id: transactionId,
      amount,
      method,
      status: 'pending'
    });

    return await this.paymentRepository.save(payment);
  }

  // 更新支付状态
  async updatePaymentStatus(
    transactionId: string,
    status: 'success' | 'failed' | 'refunded',
    refundAmount?: number,
    refundReason?: string
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOneBy({ transaction_id: transactionId });
    if (!payment) {
      throw new Error('支付记录不存在');
    }

    payment.status = status;
    if (refundAmount) {
      payment.refund_amount = refundAmount;
    }
    if (refundReason) {
      payment.refund_reason = refundReason;
    }

    // 更新订单状态
    if (status === 'success') {
      await this.orderRepository.update(
        { id: payment.order_id },
        { status: 'paid', payment_transaction_id: transactionId }
      );
    } else if (status === 'refunded') {
      await this.orderRepository.update(
        { id: payment.order_id },
        { status: 'refunded' }
      );
    }

    return await this.paymentRepository.save(payment);
  }

  // 查询支付记录
  async getPaymentByTransactionId(transactionId: string): Promise<Payment | null> {
    return await this.paymentRepository.findOneBy({ transaction_id: transactionId });
  }

  // 查询订单的支付记录
  async getPaymentsByOrderId(orderId: number): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { order_id: orderId },
      order: { created_at: 'DESC' }
    });
  }

  // 生成微信支付参数
  async generateWechatPayParams(orderId: number, amount: number, openid: string): Promise<any> {
    // 这里是模拟实现，实际应该调用微信支付API
    return {
      appId: env.WECHAT_APPID,
      timeStamp: Date.now().toString(),
      nonceStr: Math.random().toString(36).substr(2, 15),
      package: `prepay_id=wx${Date.now()}`,
      signType: 'RSA',
      paySign: '模拟签名'
    };
  }

  // 生成支付宝支付参数
  async generateAlipayPayParams(orderId: number, amount: number, returnUrl: string): Promise<any> {
    // 这里是模拟实现，实际应该调用支付宝支付API
    return {
      app_id: env.ALIPAY_APPID,
      method: 'alipay.trade.page.pay',
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp: new Date().toISOString().replace(/T/g, ' ').substr(0, 19),
      version: '1.0',
      notify_url: `${env.ALIPAY_GATEWAY}/notify`,
      return_url: returnUrl,
      biz_content: JSON.stringify({
        out_trade_no: orderId,
        product_code: 'FAST_INSTANT_TRADE_PAY',
        total_amount: amount.toFixed(2),
        subject: `订单支付 ${orderId}`,
        body: `订单 ${orderId} 的支付请求`
      })
    };
  }
}
