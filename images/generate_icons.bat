@echo off
chcp 65001 >nul
echo 正在生成数独小程序图标...

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo 错误：未找到Python，请先安装Python
    echo 下载地址：https://www.python.org/downloads/
    pause
    exit /b 1
)

REM 检查PIL库是否安装
python -c "from PIL import Image" >nul 2>&1
if errorlevel 1 (
    echo 正在安装PIL库...
    pip install Pillow
    if errorlevel 1 (
        echo 错误：PIL库安装失败
        pause
        exit /b 1
    )
)

REM 运行Python脚本
echo 正在生成图标文件...
python generate_icons.py

if errorlevel 1 (
    echo 错误：图标生成失败
    pause
    exit /b 1
)

echo.
echo 图标生成完成！
echo 现在可以重新编译小程序，tabBar图标错误应该解决了。
echo.
pause
