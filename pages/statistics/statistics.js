// pages/statistics/statistics.js
const { GameStorage } = require('../../utils/storage.js');

Page({
  data: {
    statistics: {},
    difficultyStats: [],
    recentGames: [],
    achievements: [],
    showResetDialog: false
  },

  storage: null,

  onLoad() {
    this.storage = new GameStorage();
    this.loadStatistics();
    this.generateAchievements();
  },

  onShow() {
    // 页面显示时刷新统计数据
    this.loadStatistics();
  },

  // 加载统计数据
  loadStatistics() {
    const stats = this.storage.loadGameStatistics();
    const savedGames = this.storage.loadSavedGames();
    
    // 处理统计数据
    const processedStats = this.processStatistics(stats);
    
    // 处理难度统计
    const difficultyStats = this.processDifficultyStats(stats);
    
    // 处理最近游戏
    const recentGames = this.processRecentGames(savedGames);
    
    this.setData({
      statistics: processedStats,
      difficultyStats,
      recentGames
    });
  },

  // 处理统计数据
  processStatistics(stats) {
    const completionRate = stats.totalGames > 0 
      ? Math.round((stats.completedGames / stats.totalGames) * 100) 
      : 0;
    
    const averageTimeDisplay = stats.averageTime > 0 
      ? this.formatTime(stats.averageTime) 
      : '--:--';
    
    const bestTimeDisplay = stats.bestTime 
      ? this.formatTime(stats.bestTime) 
      : '--:--';
    
    const lastPlayedDisplay = stats.lastPlayed 
      ? this.formatDate(new Date(stats.lastPlayed)) 
      : '从未';
    
    return {
      ...stats,
      completionRate,
      averageTimeDisplay,
      bestTimeDisplay,
      lastPlayedDisplay
    };
  },

  // 处理难度统计
  processDifficultyStats(stats) {
    const difficultyNames = {
      'easy': '简单',
      'medium': '中等', 
      'hard': '困难',
      'expert': '专家'
    };
    
    return Object.entries(stats.difficultyStats).map(([difficulty, data]) => {
      const completionRate = data.played > 0 
        ? Math.round((data.completed / data.played) * 100) 
        : 0;
      
      const bestTimeDisplay = data.bestTime 
        ? this.formatTime(data.bestTime) 
        : '--:--';
      
      return {
        difficulty,
        name: difficultyNames[difficulty],
        played: data.played,
        completed: data.completed,
        completionRate,
        bestTime: data.bestTime,
        bestTimeDisplay
      };
    });
  },

  // 处理最近游戏
  processRecentGames(savedGames) {
    const difficultyNames = {
      'easy': '简单',
      'medium': '中等',
      'hard': '困难', 
      'expert': '专家'
    };
    
    return Object.values(savedGames)
      .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
      .slice(0, 10)
      .map(game => ({
        id: game.id,
        dateDisplay: this.formatDate(new Date(game.savedAt)),
        completed: game.completed || false,
        timeSpent: game.timeSpent || 0,
        timeDisplay: game.timeSpent ? this.formatTime(game.timeSpent) : '--:--',
        difficulty: game.difficulty || 'medium',
        difficultyName: difficultyNames[game.difficulty] || '中等'
      }));
  },

  // 生成成就系统
  generateAchievements() {
    const stats = this.storage.loadGameStatistics();
    
    const achievements = [
      {
        id: 'first_game',
        icon: '🎯',
        name: '初次尝试',
        description: '完成第一局游戏',
        unlocked: stats.totalGames > 0,
        progress: null
      },
      {
        id: 'speed_demon',
        icon: '⚡',
        name: '速度之王',
        description: '在5分钟内完成一局游戏',
        unlocked: stats.bestTime && stats.bestTime < 300,
        progress: null
      },
      {
        id: 'persistent',
        icon: '🏆',
        name: '坚持不懈',
        description: '完成10局游戏',
        unlocked: stats.completedGames >= 10,
        progress: { current: stats.completedGames, target: 10 }
      },
      {
        id: 'master',
        icon: '👑',
        name: '数独大师',
        description: '完成50局游戏',
        unlocked: stats.completedGames >= 50,
        progress: { current: stats.completedGames, target: 50 }
      },
      {
        id: 'difficulty_explorer',
        icon: '🌍',
        name: '难度探索者',
        description: '尝试所有难度级别',
        unlocked: this.checkAllDifficultiesTried(stats),
        progress: null
      },
      {
        id: 'perfect_player',
        icon: '💎',
        name: '完美玩家',
        description: '完成率达到80%以上',
        unlocked: stats.totalGames > 0 && (stats.completedGames / stats.totalGames) >= 0.8,
        progress: { 
          current: stats.totalGames > 0 ? Math.round((stats.completedGames / stats.totalGames) * 100) : 0, 
          target: 80 
        }
      }
    ];
    
    this.setData({ achievements });
  },

  // 检查是否尝试过所有难度
  checkAllDifficultiesTried(stats) {
    const difficulties = ['easy', 'medium', 'hard', 'expert'];
    return difficulties.every(difficulty => 
      stats.difficultyStats[difficulty] && stats.difficultyStats[difficulty].played > 0
    );
  },

  // 格式化时间
  formatTime(seconds) {
    if (!seconds || seconds < 0) return '--:--';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  // 格式化日期
  formatDate(date) {
    if (!date || isNaN(date.getTime())) return '未知';
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return '昨天';
    } else if (diffDays === 2) {
      return '前天';
    } else if (diffDays <= 7) {
      return `${diffDays}天前`;
    } else if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks}周前`;
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  },

  // 显示重置统计对话框
  onResetStats() {
    this.setData({ showResetDialog: true });
  },

  // 确认重置统计
  confirmResetStats() {
    try {
      // 清除统计数据
      this.storage.saveGameStatistics(this.storage.getDefaultStatistics());
      
      // 刷新页面数据
      this.loadStatistics();
      this.generateAchievements();
      
      // 显示成功提示
      wx.showToast({
        title: '统计已重置',
        icon: 'success',
        duration: 2000
      });
      
      this.setData({ showResetDialog: false });
      
    } catch (error) {
      console.error('重置统计失败:', error);
      wx.showToast({
        title: '重置失败',
        icon: 'error',
        duration: 2000
      });
    }
  },

  // 取消重置统计
  cancelResetStats() {
    this.setData({ showResetDialog: false });
  }
});
