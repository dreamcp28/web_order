import express from 'express';
import cors from 'cors';
import { env } from './config/env';

// 创建Express应用
const app = express();

// 配置CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// 配置解析JSON请求体
app.use(express.json({ limit: '10mb' }));

// 配置解析URL编码请求体
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API路由前缀
const API_PREFIX = '/api/chat';

// 健康检查接口
app.get('/health', (req, res) => {
  res.status(200).json({
    code: 200,
    message: '智能客服服务运行正常',
    data: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      service: 'chat-service'
    }
  });
});

// 智能客服API路由
app.post(`${API_PREFIX}/message`, async (req, res) => {
  try {
    const { message, userId, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({
        code: 400,
        message: '消息内容不能为空',
        error: 'Message is required'
      });
    }

    // 简单的AI回复生成逻辑（可以后续接入真实的AI服务）
    const reply = generateAIReply(message);
    
    res.json({
      code: 200,
      message: '回复成功',
      data: {
        reply,
        sessionId: sessionId || `session_${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('处理消息错误:', error);
    res.status(500).json({
      code: 500,
      message: '处理消息失败',
      error: error.message
    });
  }
});

// 获取会话历史
app.get(`${API_PREFIX}/history/:sessionId`, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // TODO: 从数据库获取会话历史
    res.json({
      code: 200,
      message: '获取成功',
      data: {
        sessionId,
        messages: [],
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('获取历史错误:', error);
    res.status(500).json({
      code: 500,
      message: '获取历史失败',
      error: error.message
    });
  }
});

// AI回复生成函数
function generateAIReply(userMessage: string): string {
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
}

// 404路由处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: 'API接口不存在',
    error: 'Not Found'
  });
});

// 全局错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('全局错误:', err);
  
  res.status(err.status || 500).json({
    code: err.status || 500,
    message: err.message || '服务器内部错误',
    error: err.stack || 'Internal server error'
  });
});

export default app;


