# 测试目录

本目录包含前端本地测试相关的文档和脚本。

## 文件说明

- `FRONTEND_TEST.md` - 前端本地测试详细指南
- `test-checklist.md` - 测试检查清单
- `start-frontend.sh` - Linux/Mac 启动脚本
- `start-frontend.bat` - Windows 启动脚本
- `README.md` - 本文件

## 快速开始

### Linux/Mac 用户

```bash
# 给脚本添加执行权限
chmod +x test/start-frontend.sh

# 启动前端测试环境（使用默认后端地址）
./test/start-frontend.sh

# 或指定后端地址
./test/start-frontend.sh http://59.110.44.122:3000/api
```

### Windows 用户

```cmd
# 启动前端测试环境（使用默认后端地址）
test\start-frontend.bat

# 或指定后端地址
test\start-frontend.bat http://59.110.44.122:3000/api
```

### 手动启动

```bash
# 1. 进入前端目录
cd frontend

# 2. 安装依赖（如果还没有）
npm install

# 3. 创建环境变量文件
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env.local

# 4. 启动开发服务器
npm run dev
```

## 测试流程

1. 阅读 `FRONTEND_TEST.md` 了解详细测试方法
2. 使用 `test-checklist.md` 进行系统化测试
3. 记录测试结果和发现的问题

## 注意事项

- `.env.local` 文件已被 gitignore 忽略，不会提交到仓库
- 测试前确保后端服务已启动
- 如果后端地址改变，需要更新 `.env.local` 文件

