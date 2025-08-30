// pages/index/index.js
const { SudokuGame, LOCAL_PUZZLES } = require('../../utils/sudoku.js');
const { GameStorage } = require('../../utils/storage.js');

Page({
  data: {
    // 游戏状态
    board: [],
    initialBoard: [],
    selectedCell: null,
    isSolved: false,
    conflicts: [],
    isLoading: false,
    
    // UI状态
    showSolvedDialog: false,
    showNetworkDialog: false,
    
    // 游戏信息
    timeDisplay: '00:00',
    hintsUsed: 0,
    maxHints: 3,
    
    // 设置
    showTimer: true,
    showHints: true,
    
    // 其他
    networkStatus: '',
    errorMessage: null,
    solvedMessage: ''
  },

  // 游戏引擎和存储
  gameEngine: null,
  storage: null,
  gameTimer: null,
  gameStartTime: null,

  onLoad() {
    this.initializeGame();
  },

  onShow() {
    // 页面显示时加载设置
    this.loadSettings();
  },

  onHide() {
    // 页面隐藏时保存游戏状态
    this.saveGameState();
  },

  onUnload() {
    // 页面卸载时清理定时器
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
  },

  // 初始化游戏
  initializeGame() {
    this.gameEngine = new SudokuGame();
    this.storage = new GameStorage();
    
    // 尝试恢复游戏状态
    this.restoreGameState();
    
    // 如果没有恢复的游戏，开始新游戏
    if (this.data.board.length === 0) {
      this.startNewGame();
    }
  },

  // 加载设置
  loadSettings() {
    const settings = this.storage.loadSettings();
    this.setData({
      showTimer: settings.showTimer,
      showHints: settings.showHints,
      maxHints: settings.maxHints
    });
  },

  // 开始新游戏
  startNewGame(difficulty = 'medium', useOnline = false) {
    this.setData({
      isLoading: true,
      isSolved: false,
      hintsUsed: 0,
      conflicts: [],
      selectedCell: null
    });

    // 停止当前定时器
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }

    try {
      let puzzle;
      
      if (useOnline) {
        // 在线获取谜题（这里使用本地谜题模拟）
        puzzle = this.getOnlinePuzzle();
      } else {
        // 使用本地谜题
        puzzle = this.gameEngine.generatePuzzle(difficulty);
      }

      this.setData({
        board: puzzle.board.map(row => [...row]),
        initialBoard: puzzle.initialBoard.map(row => [...row]),
        isLoading: false
      });

      // 开始计时
      this.startTimer();
      
      // 保存游戏状态
      this.saveGameState();
      
    } catch (error) {
      console.error('开始新游戏失败:', error);
      this.setData({
        isLoading: false,
        errorMessage: '开始新游戏失败，请重试'
      });
      
      // 3秒后清除错误信息
      setTimeout(() => {
        this.setData({ errorMessage: null });
      }, 3000);
    }
  },

  // 获取在线谜题（模拟）
  getOnlinePuzzle() {
    // 这里应该调用真实的API
    // 目前使用本地谜题模拟
    const randomIndex = Math.floor(Math.random() * LOCAL_PUZZLES.length);
    const puzzle = LOCAL_PUZZLES[randomIndex];
    
    return {
      board: puzzle.map(row => [...row]),
      solution: this.gameEngine.generateSolution(),
      initialBoard: puzzle.map(row => [...row])
    };
  },

  // 开始计时
  startTimer() {
    this.gameStartTime = Date.now();
    this.gameTimer = setInterval(() => {
      const elapsed = Date.now() - this.gameStartTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      this.setData({ timeDisplay });
    }, 1000);
  },

  // 停止计时
  stopTimer() {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
  },

  // 单元格点击事件
  onCellClick(e) {
    const { row, col } = e.currentTarget.dataset;
    
    // 检查是否是初始数字
    if (this.data.initialBoard[row][col]) {
      return;
    }
    
    this.setData({
      selectedCell: [row, col]
    });
  },

  // 数字点击事件
  onNumberClick(e) {
    const number = e.currentTarget.dataset.number;
    
    if (this.data.selectedCell && !this.data.isSolved) {
      const [row, col] = this.data.selectedCell;
      
      // 更新棋盘
      const newBoard = this.data.board.map(row => [...row]);
      newBoard[row][col] = number;
      
      this.setData({
        board: newBoard,
        selectedCell: null
      });
      
      // 检查冲突
      this.checkConflicts(newBoard);
      
      // 检查游戏是否完成
      this.checkGameCompletion(newBoard);
      
      // 保存游戏状态
      this.saveGameState();
    }
  },

  // 清除按钮点击事件
  onClearClick() {
    if (this.data.selectedCell && !this.data.isSolved) {
      const [row, col] = this.data.selectedCell;
      
      // 更新棋盘
      const newBoard = this.data.board.map(row => [...row]);
      newBoard[row][col] = 0;
      
      this.setData({
        board: newBoard,
        selectedCell: null
      });
      
      // 检查冲突
      this.checkConflicts(newBoard);
      
      // 保存游戏状态
      this.saveGameState();
    }
  },

  // 新游戏按钮点击事件
  onNewGameClick() {
    if (this.data.showSolvedDialog) {
      this.setData({ showSolvedDialog: false });
    }
    this.showNetworkDialog();
  },

  // 显示网络选择对话框
  showNetworkDialog() {
    this.setData({ showNetworkDialog: true });
  },

  // 在线谜题选择
  onOnlinePuzzle() {
    this.setData({ showNetworkDialog: false });
    this.startNewGame('medium', true);
  },

  // 本地谜题选择
  onLocalPuzzle() {
    this.setData({ showNetworkDialog: false });
    this.startNewGame('medium', false);
  },

  // 关闭对话框
  onCloseDialog() {
    this.setData({
      showSolvedDialog: false,
      showNetworkDialog: false
    });
  },

  // 开始新游戏（从完成对话框）
  onStartNewGame() {
    this.setData({ showSolvedDialog: false });
    this.startNewGame();
  },

  // 提示按钮点击事件
  onHintClick() {
    if (this.data.hintsUsed < this.data.maxHints && !this.data.isSolved) {
      const hint = this.gameEngine.getHint(this.data.board);
      
      if (hint) {
        const newBoard = this.data.board.map(row => [...row]);
        newBoard[hint.row][hint.col] = hint.number;
        
        this.setData({
          board: newBoard,
          hintsUsed: this.data.hintsUsed + 1
        });
        
        // 检查冲突和游戏完成
        this.checkConflicts(newBoard);
        this.checkGameCompletion(newBoard);
        
        // 保存游戏状态
        this.saveGameState();
      }
    }
  },

  // 检查冲突
  checkConflicts(board) {
    const conflicts = this.gameEngine.getConflicts(board);
    this.setData({
      conflicts: Array.from(conflicts)
    });
  },

  // 检查游戏完成
  checkGameCompletion(board) {
    if (this.gameEngine.isGameComplete(board)) {
      this.gameCompleted();
    }
  },

  // 游戏完成处理
  gameCompleted() {
    this.stopTimer();
    
    const timeSpent = Date.now() - this.gameStartTime;
    const timeSpentSeconds = Math.floor(timeSpent / 1000);
    
    // 更新统计
    this.storage.updateGameStatistics({
      completed: true,
      timeSpent: timeSpentSeconds,
      difficulty: 'medium'
    });
    
    // 显示完成对话框
    const solvedMessage = `恭喜你完成游戏！\n用时：${this.data.timeDisplay}`;
    
    this.setData({
      isSolved: true,
      showSolvedDialog: true,
      solvedMessage
    });
    
    // 震动反馈
    if (wx.vibrateShort) {
      wx.vibrateShort();
    }
  },

  // 获取单元格样式类
  getCellClass(row, col) {
    const classes = [];
    
    if (this.data.selectedCell && this.data.selectedCell[0] === row && this.data.selectedCell[1] === col) {
      classes.push('selected');
    }
    
    if (this.data.conflicts.includes(`${row},${col}`)) {
      classes.push('conflict');
    }
    
    if (this.data.initialBoard[row] && this.data.initialBoard[row][col]) {
      classes.push('initial');
    }
    
    return classes.join(' ');
  },

  // 保存游戏状态
  saveGameState() {
    if (this.data.board.length > 0) {
      const gameState = {
        board: this.data.board,
        initialBoard: this.data.initialBoard,
        gameStartTime: this.gameStartTime,
        hintsUsed: this.data.hintsUsed,
        timeDisplay: this.data.timeDisplay
      };
      
      this.storage.saveGameState(gameState);
    }
  },

  // 恢复游戏状态
  restoreGameState() {
    const gameState = this.storage.loadGameState();
    
    if (gameState && gameState.board) {
      this.setData({
        board: gameState.board,
        initialBoard: gameState.initialBoard,
        hintsUsed: gameState.hintsUsed || 0,
        timeDisplay: gameState.timeDisplay || '00:00'
      });
      
      // 恢复计时器
      if (gameState.gameStartTime) {
        this.gameStartTime = gameState.gameStartTime;
        this.startTimer();
      }
      
      // 检查冲突
      this.checkConflicts(gameState.board);
      
      // 检查游戏是否完成
      this.checkGameCompletion(gameState.board);
    }
  },

  // 跳转到设置页面
  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  }
});
