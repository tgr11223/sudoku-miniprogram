// utils/storage.js
// 本地存储管理

class GameStorage {
  constructor() {
    this.storageKeys = {
      GAME_STATE: 'sudoku_game_state',
      GAME_STATISTICS: 'sudoku_game_statistics',
      SETTINGS: 'sudoku_settings',
      SAVED_GAMES: 'sudoku_saved_games'
    };
  }

  // 保存游戏状态
  saveGameState(gameState) {
    try {
      wx.setStorageSync(this.storageKeys.GAME_STATE, gameState);
      return true;
    } catch (error) {
      console.error('保存游戏状态失败:', error);
      return false;
    }
  }

  // 加载游戏状态
  loadGameState() {
    try {
      return wx.getStorageSync(this.storageKeys.GAME_STATE) || null;
    } catch (error) {
      console.error('加载游戏状态失败:', error);
      return null;
    }
  }

  // 清除游戏状态
  clearGameState() {
    try {
      wx.removeStorageSync(this.storageKeys.GAME_STATE);
      return true;
    } catch (error) {
      console.error('清除游戏状态失败:', error);
      return false;
    }
  }

  // 保存游戏统计
  saveGameStatistics(statistics) {
    try {
      wx.setStorageSync(this.storageKeys.GAME_STATISTICS, statistics);
      return true;
    } catch (error) {
      console.error('保存游戏统计失败:', error);
      return false;
    }
  }

  // 加载游戏统计
  loadGameStatistics() {
    try {
      return wx.getStorageSync(this.storageKeys.GAME_STATISTICS) || this.getDefaultStatistics();
    } catch (error) {
      console.error('加载游戏统计失败:', error);
      return this.getDefaultStatistics();
    }
  }

  // 获取默认统计数据
  getDefaultStatistics() {
    return {
      totalGames: 0,
      completedGames: 0,
      totalTime: 0,
      averageTime: 0,
      bestTime: null,
      difficultyStats: {
        easy: { played: 0, completed: 0, bestTime: null },
        medium: { played: 0, completed: 0, bestTime: null },
        hard: { played: 0, completed: 0, bestTime: null },
        expert: { played: 0, completed: 0, bestTime: null }
      },
      lastPlayed: null
    };
  }

  // 更新游戏统计
  updateGameStatistics(gameResult) {
    const stats = this.loadGameStatistics();
    
    stats.totalGames++;
    if (gameResult.completed) {
      stats.completedGames++;
    }
    
    if (gameResult.timeSpent) {
      stats.totalTime += gameResult.timeSpent;
      stats.averageTime = stats.totalTime / stats.completedGames;
      
      if (!stats.bestTime || gameResult.timeSpent < stats.bestTime) {
        stats.bestTime = gameResult.timeSpent;
      }
    }
    
    if (gameResult.difficulty && stats.difficultyStats[gameResult.difficulty]) {
      const diffStats = stats.difficultyStats[gameResult.difficulty];
      diffStats.played++;
      if (gameResult.completed) {
        diffStats.completed++;
        if (!diffStats.bestTime || gameResult.timeSpent < diffStats.bestTime) {
          diffStats.bestTime = gameResult.timeSpent;
        }
      }
    }
    
    stats.lastPlayed = new Date().toISOString();
    
    this.saveGameStatistics(stats);
    return stats;
  }

  // 保存设置
  saveSettings(settings) {
    try {
      wx.setStorageSync(this.storageKeys.SETTINGS, settings);
      return true;
    } catch (error) {
      console.error('保存设置失败:', error);
      return false;
    }
  }

  // 加载设置
  loadSettings() {
    try {
      return wx.getStorageSync(this.storageKeys.SETTINGS) || this.getDefaultSettings();
    } catch (error) {
      console.error('加载设置失败:', error);
      return this.getDefaultSettings();
    }
  }

  // 获取默认设置
  getDefaultSettings() {
    return {
      soundEnabled: true,
      vibrationEnabled: true,
      autoSave: true,
      difficulty: 'medium',
      theme: 'light',
      showTimer: true,
      showHints: true,
      maxHints: 3
    };
  }

  // 保存游戏存档
  saveGame(gameData) {
    try {
      const savedGames = this.loadSavedGames();
      const gameId = `game_${Date.now()}`;
      
      savedGames[gameId] = {
        ...gameData,
        id: gameId,
        savedAt: new Date().toISOString()
      };
      
      // 限制保存的游戏数量
      const gameIds = Object.keys(savedGames);
      if (gameIds.length > 10) {
        const oldestGameId = gameIds[0];
        delete savedGames[oldestGameId];
      }
      
      wx.setStorageSync(this.storageKeys.SAVED_GAMES, savedGames);
      return gameId;
    } catch (error) {
      console.error('保存游戏失败:', error);
      return null;
    }
  }

  // 加载保存的游戏
  loadSavedGames() {
    try {
      return wx.getStorageSync(this.storageKeys.SAVED_GAMES) || {};
    } catch (error) {
      console.error('加载保存的游戏失败:', error);
      return {};
    }
  }

  // 删除保存的游戏
  deleteSavedGame(gameId) {
    try {
      const savedGames = this.loadSavedGames();
      delete savedGames[gameId];
      wx.setStorageSync(this.storageKeys.SAVED_GAMES, savedGames);
      return true;
    } catch (error) {
      console.error('删除保存的游戏失败:', error);
      return false;
    }
  }

  // 清除所有数据
  clearAllData() {
    try {
      Object.values(this.storageKeys).forEach(key => {
        wx.removeStorageSync(key);
      });
      return true;
    } catch (error) {
      console.error('清除所有数据失败:', error);
      return false;
    }
  }

  // 获取存储使用情况
  getStorageInfo() {
    try {
      return wx.getStorageInfoSync();
    } catch (error) {
      console.error('获取存储信息失败:', error);
      return null;
    }
  }
}

module.exports = {
  GameStorage
};
