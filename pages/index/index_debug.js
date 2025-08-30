// pages/index/index_debug.js - 调试版本
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
    solvedMessage: '',
    
    // 调试信息
    debugInfo: '',
    gameEngineStatus: '未初始化',
    storageStatus: '未初始化'
  },

  // 游戏引擎和存储
  gameEngine: null,
  storage: null,
  gameTimer: null,
  gameStartTime: null,

  onLoad() {
    console.log('页面加载开始');
    this.initializeGame();
  },

  onShow() {
    console.log('页面显示');
    this.loadSettings();
  },

  onHide() {
    console.log('页面隐藏');
    this.saveGameState();
  },

  onUnload() {
    console.log('页面卸载');
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
  },

  // 初始化游戏
  initializeGame() {
    console.log('开始初始化游戏...');
    
    try {
      // 初始化游戏引擎
      console.log('正在创建游戏引擎...');
      this.gameEngine = new SudokuGame();
      console.log('游戏引擎创建成功:', this.gameEngine);
      
      // 初始化存储
      console.log('正在初始化存储...');
      this.storage = new GameStorage();
      console.log('存储初始化成功:', this.storage);
      
      this.setData({
        gameEngineStatus: '已初始化',
        storageStatus: '已初始化',
        debugInfo: '游戏引擎和存储初始化成功'
      });
      
      // 尝试恢复游戏状态
      console.log('尝试恢复游戏状态...');
      this.restoreGameState();
      
      // 如果没有恢复的游戏，开始新游戏
      if (this.data.board.length === 0) {
        console.log('没有恢复的游戏状态，开始新游戏...');
        this.startNewGame();
      } else {
        console.log('已恢复游戏状态，棋盘大小:', this.data.board.length);
      }
      
    } catch (error) {
      console.error('游戏初始化失败:', error);
      this.setData({
        errorMessage: `游戏初始化失败: ${error.message}`,
        debugInfo: `错误详情: ${error.stack}`,
        gameEngineStatus: '初始化失败',
        storageStatus: '初始化失败'
      });
    }
  },

  // 加载设置
  loadSettings() {
    try {
      const settings = this.storage.loadSettings();
      console.log('加载设置:', settings);
      this.setData({
        showTimer: settings.showTimer,
        showHints: settings.showHints,
        maxHints: settings.maxHints
      });
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  },

  // 开始新游戏
  startNewGame(difficulty = 'medium', useOnline = false) {
    console.log('开始新游戏:', { difficulty, useOnline });
    
    this.setData({
      isLoading: true,
      isSolved: false,
      hintsUsed: 0,
      conflicts: [],
      selectedCell: null,
      debugInfo: '正在生成新游戏...'
    });

    // 停止当前定时器
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }

    try {
      let puzzle;
      
      if (useOnline) {
        console.log('获取在线谜题...');
        puzzle = this.getOnlinePuzzle();
      } else {
        console.log('生成本地谜题...');
        puzzle = this.gameEngine.generatePuzzle(difficulty);
      }
      
      console.log('谜题生成成功:', puzzle);
      
      if (!puzzle || !puzzle.board) {
        throw new Error('谜题数据无效');
      }
      
      const newBoard = puzzle.board.map(row => [...row]);
      const newInitialBoard = puzzle.initialBoard.map(row => [...row]);
      
      console.log('新棋盘数据:', { newBoard, newInitialBoard });
      
      this.setData({
        board: newBoard,
        initialBoard: newInitialBoard,
        isLoading: false,
        debugInfo: `游戏开始成功！棋盘大小: ${newBoard.length}x${newBoard[0].length}`
      });

      // 开始计时
      this.startTimer();
      
      // 保存游戏状态
      this.saveGameState();
      
    } catch (error) {
      console.error('开始新游戏失败:', error);
      this.setData({
        isLoading: false,
        errorMessage: `开始新游戏失败: ${error.message}`,
        debugInfo: `错误详情: ${error.stack}`
      });
      
      // 3秒后清除错误信息
      setTimeout(() => {
        this.setData({ errorMessage: null });
      }, 3000);
    }
  },

  // 获取在线谜题（模拟）
  getOnlinePuzzle() {
    console.log('获取在线谜题（模拟）...');
    const randomIndex = Math.floor(Math.random() * LOCAL_PUZZLES.length);
    const puzzle = LOCAL_PUZZLES[randomIndex];
    
    console.log('选择的本地谜题:', puzzle);
    
    return {
      board: puzzle.map(row => [...row]),
      solution: this.gameEngine.generateSolution(),
      initialBoard: puzzle.map(row => [...row])
    };
  },

  // 开始计时
  startTimer() {
    console.log('开始计时...');
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
    console.log('单元格点击:', { row, col });
    
    // 检查是否是初始数字
    if (this.data.initialBoard[row][col]) {
      console.log('这是初始数字，不能修改');
      return;
    }
    
    this.setData({
      selectedCell: [row, col]
    });
  },

  // 数字点击事件
  onNumberClick(e) {
    const number = e.currentTarget.dataset.number;
    console.log('数字点击:', number);
    
    if (this.data.selectedCell && !this.data.isSolved) {
      const [row, col] = this.data.selectedCell;
      
      // 更新棋盘
      const newBoard = this.data.board.map(row => [...row]);
      newBoard[row][col] = number;
      
      console.log('更新棋盘:', { row, col, number, newBoard });
      
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
    console.log('清除按钮点击');
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
    console.log('新游戏按钮点击');
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
    console.log('选择在线谜题');
    this.setData({ showNetworkDialog: false });
    this.startNewGame('medium', true);
  },

  // 本地谜题选择
  onLocalPuzzle() {
    console.log('选择本地谜题');
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
    console.log('提示按钮点击');
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
    console.log('游戏完成！');
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
      console.log('恢复游戏状态:', gameState);
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
    } else {
      console.log('没有找到可恢复的游戏状态');
    }
  },

  // 跳转到设置页面
  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  // 调试功能：强制开始新游戏
  forceNewGame() {
    console.log('强制开始新游戏');
    this.startNewGame();
  },

  // 调试功能：显示当前状态
  showDebugInfo() {
    console.log('当前页面数据:', this.data);
    console.log('游戏引擎:', this.gameEngine);
    console.log('存储:', this.storage);
  }
});



