#!/bin/bash

# 前端本地测试启动脚本
# 使用方法: ./test/start-frontend.sh [backend-url]

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}前端本地测试环境启动脚本${NC}"
echo -e "${GREEN}========================================${NC}"

# 获取脚本所在目录的父目录（项目根目录）
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

# 检查是否在正确的目录
if [ ! -f "$FRONTEND_DIR/package.json" ]; then
    echo -e "${RED}错误: 找不到 frontend/package.json${NC}"
    echo "请确保在项目根目录运行此脚本"
    exit 1
fi

# 获取后端 URL（如果提供）
BACKEND_URL=${1:-"http://localhost:3000/api"}

echo -e "${YELLOW}后端 API 地址: $BACKEND_URL${NC}"

# 进入前端目录
cd "$FRONTEND_DIR"

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}检测到未安装依赖，正在安装...${NC}"
    npm install
fi

# 创建 .env.local 文件
ENV_FILE=".env.local"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}创建环境变量文件: $ENV_FILE${NC}"
    echo "VITE_API_BASE_URL=$BACKEND_URL" > "$ENV_FILE"
else
    # 更新环境变量
    if grep -q "VITE_API_BASE_URL" "$ENV_FILE"; then
        # 如果存在，更新它
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=$BACKEND_URL|" "$ENV_FILE"
        else
            # Linux
            sed -i "s|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=$BACKEND_URL|" "$ENV_FILE"
        fi
    else
        # 如果不存在，添加它
        echo "VITE_API_BASE_URL=$BACKEND_URL" >> "$ENV_FILE"
    fi
    echo -e "${GREEN}已更新环境变量文件${NC}"
fi

# 显示环境变量
echo -e "${GREEN}当前环境变量配置:${NC}"
cat "$ENV_FILE"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}启动开发服务器...${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}前端地址: http://localhost:5173${NC}"
echo -e "${YELLOW}后端 API: $BACKEND_URL${NC}"
echo ""
echo -e "${GREEN}按 Ctrl+C 停止服务器${NC}"
echo ""

# 启动开发服务器
npm run dev

