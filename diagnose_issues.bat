@echo off
chcp 65001 >nul
echo ========================================
echo 问题诊断 - 分析当前错误情况
echo ========================================
echo.

echo 正在诊断问题...
echo.

echo 1. 检查当前配置文件...
echo   当前基础库版本：
findstr "libVersion" "project.config.json"
echo.

echo 2. 检查开发工具进程...
echo   正在运行的开发工具进程：
tasklist | findstr "WeChat"
echo.

echo 3. 检查系统缓存目录...
echo   检查 %APPDATA%\WeChat Developer Tools：
if exist "%APPDATA%\WeChat Developer Tools" (
    echo   [存在] 需要清理
) else (
    echo   [不存在] 已清理
)

echo   检查 %LOCALAPPDATA%\WeChat Developer Tools：
if exist "%LOCALAPPDATA%\WeChat Developer Tools" (
    echo   [存在] 需要清理
) else (
    echo   [不存在] 已清理
)

echo   检查 %TEMP%\WeChat Developer Tools：
if exist "%TEMP%\WeChat Developer Tools" (
    echo   [存在] 需要清理
) else (
    echo   [不存在] 已清理
)

echo.
echo 4. 问题分析结果：
echo.
echo   [SharedArrayBuffer 警告]
echo   - 原因：Chrome浏览器兼容性问题
echo   - 影响：轻微，不影响功能
echo.
echo   [500 Internal Server Error]
echo   - 原因：开发工具内部服务器错误
echo   - 影响：严重，导致功能异常
echo.
echo   [enableUpdateWxAppCode 错误]
echo   - 原因：开发工具内部API错误
echo   - 影响：严重，导致编译失败
echo.
echo   [INVALID_LOGIN, access_token expired]
echo   - 原因：登录状态过期 + touristappid
echo   - 影响：严重，无法推送代码
echo.
echo 5. 推荐解决方案：
echo   - 运行 system_clean.bat 进行系统级清理
echo   - 使用基础库版本 2.27.0
echo   - 重新安装开发工具（如果问题持续）
echo.
echo ========================================
echo 诊断完成！
echo ========================================
echo.
pause


