import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// 获取订单列表（需要登录）
router.get('/orders', authMiddleware, OrderController.getOrders);

// 获取订单详情（需要登录）
router.get('/orders/:id', authMiddleware, OrderController.getOrderDetail);

// 更新订单状态（需要管理员权限）
router.put('/orders/:id/status', authMiddleware, OrderController.updateOrderStatus);

export default router;

