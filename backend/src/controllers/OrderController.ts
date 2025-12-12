import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { authMiddleware } from '../middlewares/authMiddleware';

export class OrderController {
  private orderRepository = AppDataSource.getRepository(Order);
  private orderItemRepository = AppDataSource.getRepository(OrderItem);

  // 获取订单列表（支持筛选和分页）
  static async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = '1',
        pageSize = '10',
        status,
        payment_method,
        startDate,
        endDate,
        search,
        userId
      } = req.query;

      const pageNum = parseInt(page as string, 10);
      const size = parseInt(pageSize as string, 10);
      const skip = (pageNum - 1) * size;

      const queryBuilder = AppDataSource.getRepository(Order)
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.items', 'items')
        .leftJoinAndSelect('items.product', 'product');

      // 如果是普通用户，只能查看自己的订单
      const user = (req as any).user;
      if (user && user.role_id !== 1) { // role_id 1 是管理员
        queryBuilder.where('order.user_id = :userId', { userId: user.id });
      } else if (userId) {
        queryBuilder.where('order.user_id = :userId', { userId });
      }

      // 状态筛选
      if (status) {
        queryBuilder.andWhere('order.status = :status', { status });
      }

      // 支付方式筛选
      if (payment_method) {
        queryBuilder.andWhere('order.payment_method = :payment_method', { payment_method });
      }

      // 时间范围筛选
      if (startDate) {
        queryBuilder.andWhere('order.created_at >= :startDate', { startDate });
      }
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        queryBuilder.andWhere('order.created_at <= :endDate', { endDate: end });
      }

      // 搜索（订单号或用户手机号）
      if (search) {
        queryBuilder.andWhere(
          '(order.id LIKE :search OR user.phone LIKE :search)',
          { search: `%${search}%` }
        );
      }

      // 排序
      queryBuilder.orderBy('order.created_at', 'DESC');

      // 分页
      const [orders, total] = await queryBuilder
        .skip(skip)
        .take(size)
        .getManyAndCount();

      // 格式化返回数据
      const formattedOrders = orders.map(order => ({
        id: order.id,
        order_number: `YS${String(order.id).padStart(10, '0')}`,
        user: order.user ? order.user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '',
        user_id: order.user_id,
        product: order.items && order.items.length > 0 
          ? order.items[0].product_name 
          : '未知商品',
        amount: parseFloat(order.total_amount.toString()),
        status: order.status,
        payment_method: order.payment_method,
        created_at: order.created_at.toISOString(),
        items: order.items?.map(item => ({
          id: item.id,
          product_name: item.product_name,
          product_price: parseFloat(item.product_price.toString()),
          quantity: item.quantity
        })) || []
      }));

      res.status(200).json({
        code: 200,
        message: '获取订单列表成功',
        data: {
          orders: formattedOrders,
          pagination: {
            page: pageNum,
            pageSize: size,
            total,
            totalPages: Math.ceil(total / size)
          }
        }
      });
    } catch (error) {
      console.error('获取订单列表错误:', error);
      res.status(500).json({
        code: 500,
        message: '获取订单列表失败',
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  // 获取订单详情
  static async getOrderDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      const order = await AppDataSource.getRepository(Order)
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.items', 'items')
        .leftJoinAndSelect('items.product', 'product')
        .leftJoinAndSelect('order.payments', 'payments')
        .where('order.id = :id', { id })
        .getOne();

      if (!order) {
        res.status(404).json({
          code: 404,
          message: '订单不存在',
          error: 'Order not found'
        });
        return;
      }

      // 检查权限：普通用户只能查看自己的订单
      if (user && user.role_id !== 1 && order.user_id !== user.id) {
        res.status(403).json({
          code: 403,
          message: '无权访问此订单',
          error: 'Forbidden'
        });
        return;
      }

      res.status(200).json({
        code: 200,
        message: '获取订单详情成功',
        data: {
          id: order.id,
          order_number: `YS${String(order.id).padStart(10, '0')}`,
          user: order.user ? {
            id: order.user.id,
            phone: order.user.phone,
            nickname: order.user.nickname,
            avatar: order.user.avatar
          } : null,
          total_amount: parseFloat(order.total_amount.toString()),
          status: order.status,
          payment_method: order.payment_method,
          payment_transaction_id: order.payment_transaction_id,
          shipping_address: order.shipping_address,
          remark: order.remark,
          created_at: order.created_at.toISOString(),
          updated_at: order.updated_at.toISOString(),
          items: order.items?.map(item => ({
            id: item.id,
            product_id: item.product_id,
            product_name: item.product_name,
            product_price: parseFloat(item.product_price.toString()),
            quantity: item.quantity
          })) || [],
          payments: order.payments?.map(payment => ({
            id: payment.id,
            transaction_id: payment.transaction_id,
            amount: parseFloat(payment.amount.toString()),
            status: payment.status,
            payment_method: payment.method,
            created_at: payment.created_at.toISOString()
          })) || []
        }
      });
    } catch (error) {
      console.error('获取订单详情错误:', error);
      res.status(500).json({
        code: 500,
        message: '获取订单详情失败',
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  // 更新订单状态（管理员）
  static async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const user = (req as any).user;

      // 检查管理员权限
      if (!user || user.role_id !== 1) {
        res.status(403).json({
          code: 403,
          message: '需要管理员权限',
          error: 'Admin access required'
        });
        return;
      }

      const order = await AppDataSource.getRepository(Order).findOneBy({ id: parseInt(id, 10) });
      if (!order) {
        res.status(404).json({
          code: 404,
          message: '订单不存在',
          error: 'Order not found'
        });
        return;
      }

      // 验证状态值
      const validStatuses = ['pending', 'paid', 'cancelled', 'refunded'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          code: 400,
          message: '无效的订单状态',
          error: 'Invalid order status'
        });
        return;
      }

      order.status = status;
      await AppDataSource.getRepository(Order).save(order);

      res.status(200).json({
        code: 200,
        message: '订单状态更新成功',
        data: {
          id: order.id,
          status: order.status
        }
      });
    } catch (error) {
      console.error('更新订单状态错误:', error);
      res.status(500).json({
        code: 500,
        message: '更新订单状态失败',
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }
}

