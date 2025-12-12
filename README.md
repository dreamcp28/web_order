# Web Order - 电商订单管理系统

一个基于 React + TypeScript + Node.js 的现代化电商订单管理系统。

## 技术栈

### 前端
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### 后端
- Node.js
- Express
- TypeScript
- TypeORM
- MySQL
- JWT 认证

### 部署
- Docker
- Docker Compose
- Nginx

## 功能特性

- ✅ 用户注册/登录
- ✅ 订单管理
- ✅ 商品管理
- ✅ 支付集成（微信支付、支付宝）
- ✅ 智能客服
- ✅ 管理后台

## 快速开始

### 环境要求
- Node.js 18+
- Docker & Docker Compose
- MySQL 8.0+

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/dreamcp28/web_order.git
cd web_order
```

2. 配置环境变量
```bash
cp env.example .env
# 编辑 .env 文件，配置数据库和 JWT 密钥
```

3. 启动服务
```bash
docker-compose up -d
```

4. 访问应用
- 前端: http://localhost
- 后端 API: http://localhost:3000/api
- 健康检查: http://localhost:3000/health

## 项目结构

```
web_order/
├── backend/          # 后端服务
├── frontend/         # 前端应用
├── chat-service/     # 智能客服服务
├── docker-compose.yml
└── README.md
```

## 开发

### 后端开发
```bash
cd backend
npm install
npm run dev
```

### 前端开发
```bash
cd frontend
npm install
npm run dev
```

## 许可证

MIT
