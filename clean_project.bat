@echo off
chcp 65001 >nul
echo 正在清理数独小程序项目...

REM 删除可能的问题文件
if exist "node_modules" (
    echo 删除 node_modules 目录...
    rmdir /s /q "node_modules"
)

if exist "miniprogram_npm" (
    echo 删除 miniprogram_npm 目录...
    rmdir /s /q "miniprogram_npm"
)

if exist ".idea" (
    echo 删除 .idea 目录...
    rmdir /s /q ".idea"
)

if exist ".vscode" (
    echo 删除 .vscode 目录...
    rmdir /s /q ".vscode"
)

REM 删除临时文件
if exist "*.log" (
    echo 删除日志文件...
    del /q "*.log"
)

echo.
echo 项目清理完成！
echo 请在微信开发者工具中：
echo 1. 点击"清缓存" → "清除全部缓存"
echo 2. 重新编译项目
echo 3. 如果还有问题，尝试重启开发者工具
echo.
pause
