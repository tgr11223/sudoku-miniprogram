#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成数独小程序所需的PNG图标
"""

from PIL import Image, ImageDraw
import os

def create_game_icon(color, filename):
    """创建游戏图标"""
    img = Image.new('RGBA', (48, 48), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 绘制外框
    draw.rounded_rectangle([6, 6, 42, 42], radius=4, outline=color, width=4)
    
    # 绘制横线
    for y in [12, 18, 24, 30, 36]:
        draw.line([12, y, 36, y], fill=color, width=2)
    
    img.save(filename, 'PNG')

def create_stats_icon(color, filename):
    """创建统计图标"""
    img = Image.new('RGBA', (48, 48), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 绘制柱状图
    bars = [(8, 32, 16), (20, 24, 24), (32, 16, 32)]
    for x, y, height in bars:
        draw.rectangle([x, y, x+6, y+height], fill=color)
    
    # 绘制底线
    draw.line([4, 44, 44, 44], fill=color, width=2)
    
    img.save(filename, 'PNG')

def create_settings_icon(color, filename):
    """创建设置图标"""
    img = Image.new('RGBA', (48, 48), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 绘制中心圆
    draw.ellipse([18, 18, 30, 30], outline=color, width=2)
    
    # 绘制齿轮外圈
    center = 24
    radius = 20
    for i in range(8):
        angle = i * 45
        x1 = center + int(radius * 0.7 * (angle % 90 == 0))
        y1 = center + int(radius * 0.7 * (angle % 90 != 0))
        x2 = center + int(radius * (angle % 90 == 0))
        y2 = center + int(radius * (angle % 90 != 0))
        draw.line([x1, y1, x2, y2], fill=color, width=2)
    
    img.save(filename, 'PNG')

def main():
    """主函数"""
    # 确保images目录存在
    if not os.path.exists('images'):
        os.makedirs('images')
    
    # 生成所有图标
    icons = [
        ('game', create_game_icon),
        ('stats', create_stats_icon),
        ('settings', create_settings_icon)
    ]
    
    colors = {
        'normal': '#999999',
        'active': '#4A90E2'
    }
    
    for name, create_func in icons:
        # 普通状态图标
        create_func(colors['normal'], f'{name}.png')
        # 激活状态图标
        create_func(colors['active'], f'{name}-active.png')
        print(f'已生成 {name}.png 和 {name}-active.png')
    
    print('\n所有图标已生成完成！')
    print('现在可以重新编译小程序，tabBar图标错误应该解决了。')

if __name__ == '__main__':
    main()
