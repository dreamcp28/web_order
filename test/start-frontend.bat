@echo off
REM 前端本地测试启动脚本 (Windows)
REM 使用方法: test\start-frontend.bat [backend-url]

setlocal enabledelayedexpansion

echo ========================================
echo 前端本地测试环境启动脚本
echo ========================================

REM 获取脚本所在目录的父目录（项目根目录）
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."
set "FRONTEND_DIR=%PROJECT_ROOT%frontend"

REM 检查是否在正确的目录
if not exist "%FRONTEND_DIR%\package.json" (
    echo 错误: 找不到 frontend\package.json
    echo 请确保在项目根目录运行此脚本
    exit /b 1
)

REM 获取后端 URL（如果提供）
if "%~1"=="" (
    set "BACKEND_URL=http://localhost:3000/api"
) else (
    set "BACKEND_URL=%~1"
)

echo 后端 API 地址: %BACKEND_URL%

REM 进入前端目录
cd /d "%FRONTEND_DIR%"

REM 检查 node_modules 是否存在
if not exist "node_modules" (
    echo 检测到未安装依赖，正在安装...
    call npm install
)

REM 创建 .env.local 文件
set "ENV_FILE=.env.local"
if not exist "%ENV_FILE%" (
    echo 创建环境变量文件: %ENV_FILE%
    echo VITE_API_BASE_URL=%BACKEND_URL% > "%ENV_FILE%"
) else (
    REM 更新环境变量
    findstr /C:"VITE_API_BASE_URL" "%ENV_FILE%" >nul
    if !errorlevel! equ 0 (
        REM 如果存在，更新它
        powershell -Command "(Get-Content '%ENV_FILE%') -replace 'VITE_API_BASE_URL=.*', 'VITE_API_BASE_URL=%BACKEND_URL%' | Set-Content '%ENV_FILE%'"
    ) else (
        REM 如果不存在，添加它
        echo VITE_API_BASE_URL=%BACKEND_URL% >> "%ENV_FILE%"
    )
    echo 已更新环境变量文件
)

REM 显示环境变量
echo.
echo 当前环境变量配置:
type "%ENV_FILE%"

echo.
echo ========================================
echo 启动开发服务器...
echo ========================================
echo.
echo 前端地址: http://localhost:5173
echo 后端 API: %BACKEND_URL%
echo.
echo 按 Ctrl+C 停止服务器
echo.

REM 启动开发服务器
call npm run dev

