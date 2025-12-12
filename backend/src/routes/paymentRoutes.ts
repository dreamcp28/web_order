import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// 创建支付订单（需要登录）
router.post('/payment', authMiddleware, PaymentController.createPayment);

// 查询支付记录（需要登录）
router.get('/payment/:transactionId', authMiddleware, PaymentController.getPayment);

// 查询订单的支付记录（需要登录）
router.get('/payment/order/:orderId', authMiddleware, PaymentController.getOrderPayments);

// 支付结果查询（需要登录）
router.get('/payment/result/:transactionId', authMiddleware, PaymentController.paymentResult);

// 微信支付回调（公开接口）
router.post('/payment/callback/wechat', PaymentController.wechatPayCallback);

// 支付宝支付回调（公开接口）
router.post('/payment/callback/alipay', PaymentController.alipayPayCallback);

export default router;
