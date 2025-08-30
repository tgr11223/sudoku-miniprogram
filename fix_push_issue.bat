@echo off
chcp 65001 >nul
echo ========================================
echo 修复推送问题 - 更新AppID
echo ========================================
echo.

echo 当前问题：
echo - appid: touristappid (游客模式，无法推送)
echo - 需要更新为真实的微信小程序AppID
echo.

echo 请按以下步骤操作：
echo.
echo 1. 登录微信公众平台 (https://mp.weixin.qq.com)
echo 2. 获取您的小程序AppID
echo 3. 将AppID填入下面的配置文件中
echo.

echo 正在创建修复配置文件...
echo.

echo 请手动编辑 project.config.json 文件：
echo - 找到 "appid": "touristappid"
echo - 将 "touristappid" 替换为您的真实AppID
echo - 例如: "appid": "wx1234567890abcdef"
echo.

echo 或者，您可以：
echo 1. 在微信开发者工具中重新创建项目
echo 2. 选择"小程序"项目类型
echo 3. 填入真实的AppID
echo 4. 将现有代码复制到新项目中
echo.

echo ========================================
echo 推送问题解决步骤：
echo 1. 更新AppID为真实值
echo 2. 重新登录微信开发者工具
echo 3. 清除缓存并重新编译
echo 4. 尝试推送代码
echo ========================================
echo.
pause
