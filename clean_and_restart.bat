@echo off
chcp 65001 >nul
echo ========================================
echo 数独小程序 - 清理和重启脚本
echo ========================================
echo.

echo 正在清理项目缓存...
echo.

echo 1. 删除临时文件...
if exist "node_modules" (
    echo   删除 node_modules 目录...
    rmdir /s /q "node_modules"
)

if exist "miniprogram_npm" (
    echo   删除 miniprogram_npm 目录...
    rmdir /s /q "miniprogram_npm"
)

if exist ".idea" (
    echo   删除 .idea 目录...
    rmdir /s /q ".idea"
)

if exist ".vscode" (
    echo   删除 .vscode 目录...
    rmdir /s /q ".vscode"
)

echo.
echo 2. 清理日志文件...
del /q *.log 2>nul
del /q logs\*.* 2>nul

echo.
echo 3. 清理完成！
echo.
echo ========================================
echo 下一步操作：
echo 1. 关闭 WeChat Developer Tools
echo 2. 重新打开 WeChat Developer Tools
echo 3. 重新导入项目
echo 4. 在工具栏-详情-本地设置中：
echo    - 清除缓存
echo    - 重新编译
echo ========================================
echo.
pause
