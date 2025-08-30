@echo off
chcp 65001 >nul
echo ========================================
echo 深度清理 - 解决开发工具内部错误
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
echo 3. 清理开发工具缓存...
echo   请手动删除以下目录（如果存在）：
echo   %APPDATA%\WeChat Developer Tools
echo   %LOCALAPPDATA%\WeChat Developer Tools
echo   %TEMP%\WeChat Developer Tools

echo.
echo 4. 清理完成！
echo.
echo ========================================
echo 下一步操作：
echo 1. 完全关闭 WeChat Developer Tools
echo 2. 删除开发工具缓存目录
echo 3. 重新启动 WeChat Developer Tools
echo 4. 重新导入项目
echo 5. 在工具栏-详情-本地设置中：
echo    - 清除缓存
echo    - 选择基础库版本 2.28.1 或 2.27.0
echo    - 重新编译
echo ========================================
echo.
pause
