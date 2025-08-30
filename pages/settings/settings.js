// pages/settings/settings.js
const { GameStorage } = require('../../utils/storage.js');

Page({
  data: {
    // 游戏设置
    difficultyIndex: 1,
    difficultyOptions: ['简单', '中等', '困难', '专家'],
    showTimer: true,
    showHints: true,
    maxHints: 3,
    
    // 界面设置
    themeIndex: 0,
    themeOptions: ['浅色', '深色'],
    
    // 音效设置
    soundEnabled: true,
    vibrationEnabled: true,
    
    // 数据设置
    autoSave: true,
    
    // 关于信息
    version: '1.0.0',
    
    // 对话框状态
    showClearDataDialog: false
  },

  storage: null,

  onLoad() {
    this.storage = new GameStorage();
    this.loadSettings();
  },

  // 加载设置
  loadSettings() {
    const settings = this.storage.loadSettings();
    
    // 设置难度索引
    const difficultyMap = { 'easy': 0, 'medium': 1, 'hard': 2, 'expert': 3 };
    const difficultyIndex = difficultyMap[settings.difficulty] || 1;
    
    // 设置主题索引
    const themeMap = { 'light': 0, 'dark': 1 };
    const themeIndex = themeMap[settings.theme] || 0;
    
    this.setData({
      difficultyIndex,
      themeIndex,
      showTimer: settings.showTimer,
      showHints: settings.showHints,
      maxHints: settings.maxHints,
      soundEnabled: settings.soundEnabled,
      vibrationEnabled: settings.vibrationEnabled,
      autoSave: settings.autoSave
    });
  },

  // 保存设置
  saveSettings() {
    const difficultyMap = ['easy', 'medium', 'hard', 'expert'];
    const themeMap = ['light', 'dark'];
    
    const settings = {
      difficulty: difficultyMap[this.data.difficultyIndex],
      theme: themeMap[this.data.themeIndex],
      showTimer: this.data.showTimer,
      showHints: this.data.showHints,
      maxHints: this.data.maxHints,
      soundEnabled: this.data.soundEnabled,
      vibrationEnabled: this.data.vibrationEnabled,
      autoSave: this.data.autoSave
    };
    
    this.storage.saveSettings(settings);
  },

  // 难度选择改变
  onDifficultyChange(e) {
    const index = e.detail.value;
    this.setData({ difficultyIndex: index });
    this.saveSettings();
  },

  // 主题选择改变
  onThemeChange(e) {
    const index = e.detail.value;
    this.setData({ themeIndex: index });
    this.saveSettings();
  },

  // 计时器开关改变
  onTimerChange(e) {
    this.setData({ showTimer: e.detail.value });
    this.saveSettings();
  },

  // 提示开关改变
  onHintsChange(e) {
    this.setData({ showHints: e.detail.value });
    this.saveSettings();
  },

  // 最大提示次数改变
  onMaxHintsChange(e) {
    this.setData({ maxHints: e.detail.value });
    this.saveSettings();
  },

  // 音效开关改变
  onSoundChange(e) {
    this.setData({ soundEnabled: e.detail.value });
    this.saveSettings();
  },

  // 震动开关改变
  onVibrationChange(e) {
    this.setData({ vibrationEnabled: e.detail.value });
    this.saveSettings();
  },

  // 自动保存开关改变
  onAutoSaveChange(e) {
    this.setData({ autoSave: e.detail.value });
    this.saveSettings();
  },

  // 显示清除数据对话框
  onClearData() {
    this.setData({ showClearDataDialog: true });
  },

  // 确认清除数据
  confirmClearData() {
    try {
      this.storage.clearAllData();
      
      // 重置为默认设置
      this.loadSettings();
      
      // 显示成功提示
      wx.showToast({
        title: '数据已清除',
        icon: 'success',
        duration: 2000
      });
      
      this.setData({ showClearDataDialog: false });
      
    } catch (error) {
      console.error('清除数据失败:', error);
      wx.showToast({
        title: '清除失败',
        icon: 'error',
        duration: 2000
      });
    }
  },

  // 取消清除数据
  cancelClearData() {
    this.setData({ showClearDataDialog: false });
  }
});
