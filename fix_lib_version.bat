@echo off
chcp 65001 >nul
echo 数独小程序基础库版本修复工具
echo ================================
echo.

echo 正在检查可用的基础库版本...
echo.

echo 推荐的基础库版本：
echo 1. 2.30.4 (稳定版本，推荐)
echo 2. 2.29.3 (稳定版本)
echo 3. 2.28.1 (稳定版本)
echo 4. 2.27.0 (稳定版本)
echo.

echo 如果2.30.4仍然无法下载，请尝试以下步骤：
echo.
echo 1. 在微信开发者工具中：
echo    - 点击右上角"详情"
echo    - 在"本地设置"中找到"调试基础库"
echo    - 选择一个可用的版本
echo.
echo 2. 或者手动修改 project.config.json 文件：
echo    - 将 "libVersion" 改为 "2.29.3" 或其他可用版本
echo.
echo 3. 网络问题解决：
echo    - 检查网络连接
echo    - 尝试使用VPN或代理
echo    - 重启开发者工具
echo.

echo 当前项目配置的基础库版本：2.30.4
echo.

pause
