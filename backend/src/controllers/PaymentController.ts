import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';
import { env } from '../config/env';
import { User } from '../models/User';

// 扩展Request类型，添加user属性
interface AuthenticatedRequest extends Request {
  user?: User;
}

const paymentService = new PaymentService();

export class PaymentController {
  // 创建支付订单
  static async createPayment(req: AuthenticatedRequest, res: Response) {
    try {
      const { orderId, amount, method } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: '未登录' });
      }

      if (!orderId || !amount || !method) {
        return res.status(400).json({ message: '缺少必要参数' });
      }

      // 转换orderId为number类型
      const orderIdNum = parseInt(orderId as string, 10);
      if (isNaN(orderIdNum)) {
        return res.status(400).json({ message: '无效的订单ID' });
      }

      if (!['wechat', 'alipay'].includes(method)) {
        return res.status(400).json({ message: '不支持的支付方式' });
      }

      const payment = await paymentService.createPayment(orderIdNum, amount, method as 'wechat' | 'alipay', userId);
      
      // 根据支付方式生成不同的支付参数
      let payParams;
      if (method === 'wechat') {
        // 这里需要获取用户的微信openid，实际项目中应该从用户信息中获取
        const openid = 'mock_openid';
        payParams = await paymentService.generateWechatPayParams(orderIdNum, amount, openid);
      } else {
        // 支付宝支付参数
        const returnUrl = `${env.FRONTEND_URL}/payment/result`;
        payParams = await paymentService.generateAlipayPayParams(orderIdNum, amount, returnUrl);
      }

      res.status(200).json({
        success: true,
        data: {
          payment,
          payParams
        }
      });
    } catch (error) {
      console.error('创建支付订单失败:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : '创建支付订单失败' });
    }
  }

  // 查询支付记录
  static async getPayment(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      
      if (!transactionId) {
        return res.status(400).json({ message: '缺少交易ID' });
      }

      const payment = await paymentService.getPaymentByTransactionId(transactionId);
      
      if (!payment) {
        return res.status(404).json({ message: '支付记录不存在' });
      }

      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      console.error('查询支付记录失败:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : '查询支付记录失败' });
    }
  }

  // 查询订单的支付记录
  static async getOrderPayments(req: AuthenticatedRequest, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: '未登录' });
      }

      if (!orderId) {
        return res.status(400).json({ message: '缺少订单ID' });
      }

      // 转换orderId为number类型
      const orderIdNum = parseInt(orderId as string, 10);
      if (isNaN(orderIdNum)) {
        return res.status(400).json({ message: '无效的订单ID' });
      }

      const payments = await paymentService.getPaymentsByOrderId(orderIdNum);
      
      res.status(200).json({
        success: true,
        data: payments
      });
    } catch (error) {
      console.error('查询订单支付记录失败:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : '查询订单支付记录失败' });
    }
  }

  // 微信支付回调
  static async wechatPayCallback(req: Request, res: Response) {
    try {
      // 这里应该验证微信支付的签名
      const { transaction_id, out_trade_no, result_code } = req.body;

      if (!transaction_id || !out_trade_no) {
        return res.status(400).json({ xml: { return_code: 'FAIL', return_msg: '参数错误' } });
      }

      // 更新支付状态
      const status = result_code === 'SUCCESS' ? 'success' : 'failed';
      await paymentService.updatePaymentStatus(transaction_id, status);

      // 返回微信支付要求的XML格式响应
      res.status(200).json({ xml: { return_code: 'SUCCESS', return_msg: 'OK' } });
    } catch (error) {
      console.error('微信支付回调处理失败:', error);
      res.status(500).json({ xml: { return_code: 'FAIL', return_msg: '处理失败' } });
    }
  }

  // 支付宝支付回调
  static async alipayPayCallback(req: Request, res: Response) {
    try {
      // 这里应该验证支付宝支付的签名
      const { out_trade_no, trade_no, trade_status } = req.body;

      if (!trade_no || !out_trade_no) {
        return res.status(400).send('参数错误');
      }

      // 更新支付状态
      let status: 'success' | 'failed' | 'refunded';
      if (trade_status === 'TRADE_SUCCESS' || trade_status === 'TRADE_FINISHED') {
        status = 'success';
      } else if (trade_status === 'TRADE_CLOSED' || trade_status === 'WAIT_BUYER_PAY') {
        status = 'failed';
      } else {
        status = 'failed';
      }

      await paymentService.updatePaymentStatus(trade_no, status);

      // 返回支付宝支付要求的响应
      res.status(200).send('success');
    } catch (error) {
      console.error('支付宝支付回调处理失败:', error);
      res.status(500).send('处理失败');
    }
  }

  // 支付结果查询
  static async paymentResult(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      
      if (!transactionId) {
        return res.status(400).json({ message: '缺少交易ID' });
      }

      const payment = await paymentService.getPaymentByTransactionId(transactionId);
      
      if (!payment) {
        return res.status(404).json({ message: '支付记录不存在' });
      }

      res.status(200).json({
        success: true,
        data: {
          status: payment.status,
          amount: payment.amount,
          method: payment.method,
          createdAt: payment.created_at
        }
      });
    } catch (error) {
      console.error('查询支付结果失败:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : '查询支付结果失败' });
    }
  }
}
