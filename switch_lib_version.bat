@echo off
chcp 65001 >nul
echo 数独小程序基础库版本切换工具
echo ================================
echo.

:menu
echo 请选择要使用的基础库版本：
echo.
echo 1. 2.30.4 (当前配置，推荐)
echo 2. 2.29.3 (备选版本1)
echo 3. 2.28.1 (备选版本2)
echo 4. 2.27.0 (备选版本3)
echo 5. 退出
echo.
set /p choice=请输入选择 (1-5): 

if "%choice%"=="1" goto version_2_30_4
if "%choice%"=="2" goto version_2_29_3
if "%choice%"=="3" goto version_2_28_1
if "%choice%"=="4" goto version_2_27_0
if "%choice%"=="5" goto exit
echo 无效选择，请重新输入
goto menu

:version_2_30_4
echo 正在切换到基础库版本 2.30.4...
copy "project.config.json" "project.config.backup.json" >nul
echo 已备份原配置文件
echo 当前配置已经是 2.30.4 版本
goto success

:version_2_29_3
echo 正在切换到基础库版本 2.29.3...
copy "project.config.json" "project.config.backup.json" >nul
copy "project.config.2.29.3.json" "project.config.json" >nul
echo 已切换到基础库版本 2.29.3
goto success

:version_2_28_1
echo 正在切换到基础库版本 2.28.1...
copy "project.config.json" "project.config.backup.json" >nul
copy "project.config.2.28.1.json" "project.config.json" >nul
echo 已切换到基础库版本 2.28.1
goto success

:version_2_27_0
echo 正在切换到基础库版本 2.27.0...
copy "project.config.json" "project.config.backup.json" >nul
echo 正在创建 2.27.0 版本配置...
powershell -Command "(Get-Content 'project.config.json') -replace '2.30.4', '2.27.0' | Set-Content 'project.config.json'"
echo 已切换到基础库版本 2.27.0
goto success

:success
echo.
echo 版本切换完成！
echo 请在微信开发者工具中：
echo 1. 重新导入项目或刷新
echo 2. 检查基础库版本是否正确
echo 3. 重新编译项目
echo.
echo 如果需要恢复原配置，请运行：
echo copy "project.config.backup.json" "project.config.json"
echo.
pause
goto exit

:exit
echo 感谢使用！
pause
