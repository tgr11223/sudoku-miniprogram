# 数独小程序图标文件

## 问题说明
当前 `app.json` 中引用的图标文件缺失，导致tabBar图标错误：
- `images/game.png` - 游戏图标（普通状态）
- `images/game-active.png` - 游戏图标（激活状态）
- `images/stats.png` - 统计图标（普通状态）
- `images/stats-active.png` - 统计图标（激活状态）
- `images/settings.png` - 设置图标（普通状态）
- `images/settings-active.png` - 设置图标（激活状态）

## 解决方案

### 方法1：使用Python脚本生成（推荐）
1. 确保安装了Python和PIL库：`pip install Pillow`
2. 运行脚本：`python generate_icons.py`
3. 脚本会自动生成所有需要的PNG图标文件

### 方法2：使用在线工具
1. 访问 https://convertio.co/svg-png/ 或类似的SVG转PNG工具
2. 上传对应的SVG文件进行转换
3. 下载PNG文件并重命名

### 方法3：手动创建
使用任何图像编辑软件（如Photoshop、GIMP、Paint.NET等）创建48x48像素的PNG图标

## 图标要求
- 尺寸：48x48像素
- 格式：PNG
- 普通状态颜色：#999999
- 激活状态颜色：#4A90E2

## 文件结构
```
images/
├── game.png              # 游戏图标（普通）
├── game-active.png       # 游戏图标（激活）
├── stats.png             # 统计图标（普通）
├── stats-active.png      # 统计图标（激活）
├── settings.png          # 设置图标（普通）
├── settings-active.png   # 设置图标（激活）
├── generate_icons.py     # 图标生成脚本
└── README.md            # 说明文档
```

生成图标后，重新编译小程序即可解决tabBar图标错误问题。
