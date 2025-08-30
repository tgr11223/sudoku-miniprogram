// utils/sudoku.js
// 数独游戏核心逻辑

class SudokuGame {
  constructor() {
    this.board = [];
    this.solution = [];
    this.initialBoard = [];
    this.difficulty = 'medium';
  }

  // 生成新的数独谜题
  generatePuzzle(difficulty = 'medium') {
    this.difficulty = difficulty;
    
    // 生成完整的数独解决方案
    this.solution = this.generateSolution();
    
    // 根据难度移除数字
    this.board = this.removeNumbers(this.solution, difficulty);
    this.initialBoard = this.board.map(row => [...row]);
    
    return {
      board: this.board,
      solution: this.solution,
      initialBoard: this.initialBoard
    };
  }

  // 生成完整的数独解决方案
  generateSolution() {
    const solution = Array(9).fill().map(() => Array(9).fill(0));
    
    // 填充对角线上的3x3方块（步长改为3，确保不越界）
    for (let i = 0; i < 9; i += 3) {
      this.fillBox(solution, i, i);
    }
    
    // 填充剩余的单元格
    this.solveSudoku(solution);
    
    return solution;
  }

  // 填充3x3方块
  fillBox(board, row, col) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        board[row + i][col + j] = numbers[randomIndex];
        numbers.splice(randomIndex, 1);
      }
    }
  }

  // 解决数独
  solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValid(board, row, col, num)) {
              board[row][col] = num;
              if (this.solveSudoku(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  // 检查数字是否有效
  isValid(board, row, col, num) {
    // 检查行
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }
    
    // 检查列
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }
    
    // 检查3x3方块
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num) return false;
      }
    }
    
    return true;
  }

  // 根据难度移除数字
  removeNumbers(solution, difficulty) {
    const board = solution.map(row => [...row]);
    const cellsToRemove = {
      'easy': 30,
      'medium': 40,
      'hard': 50,
      'expert': 60
    };
    
    const targetRemovals = cellsToRemove[difficulty] || 40;
    let removed = 0;
    
    while (removed < targetRemovals) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (board[row][col] !== 0) {
        board[row][col] = 0;
        removed++;
      }
    }
    
    return board;
  }

  // 检查当前棋盘是否有效
  isValidBoard(board) {
    // 检查行
    for (let row = 0; row < 9; row++) {
      const seen = new Set();
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== 0) {
          if (seen.has(board[row][col])) return false;
          seen.add(board[row][col]);
        }
      }
    }
    
    // 检查列
    for (let col = 0; col < 9; col++) {
      const seen = new Set();
      for (let row = 0; row < 9; row++) {
        if (board[row][col] !== 0) {
          if (seen.has(board[row][col])) return false;
          seen.add(board[row][col]);
        }
      }
    }
    
    // 检查3x3方块
    for (let blockRow = 0; blockRow < 3; blockRow++) {
      for (let blockCol = 0; blockCol < 3; blockCol++) {
        const seen = new Set();
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const row = blockRow * 3 + i;
            const col = blockCol * 3 + j;
            if (board[row][col] !== 0) {
              if (seen.has(board[row][col])) return false;
              seen.add(board[row][col]);
            }
          }
        }
      }
    }
    
    return true;
  }

  // 检查游戏是否完成
  isGameComplete(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) return false;
      }
    }
    return this.isValidBoard(board);
  }

  // 获取冲突的单元格
  getConflicts(board) {
    const conflicts = new Set();
    
    // 检查行冲突
    for (let row = 0; row < 9; row++) {
      const seen = new Map();
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== 0) {
          if (seen.has(board[row][col])) {
            conflicts.add(`${row},${col}`);
            conflicts.add(`${row},${seen.get(board[row][col])}`);
          } else {
            seen.set(board[row][col], col);
          }
        }
      }
    }
    
    // 检查列冲突
    for (let col = 0; col < 9; col++) {
      const seen = new Map();
      for (let row = 0; row < 9; row++) {
        if (board[row][col] !== 0) {
          if (seen.has(board[row][col])) {
            conflicts.add(`${row},${col}`);
            conflicts.add(`${seen.get(board[row][col])},${col}`);
          } else {
            seen.set(board[row][col], row);
          }
        }
      }
    }
    
    // 检查3x3方块冲突
    for (let blockRow = 0; blockRow < 3; blockRow++) {
      for (let blockCol = 0; blockCol < 3; blockCol++) {
        const seen = new Map();
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const row = blockRow * 3 + i;
            const col = blockCol * 3 + j;
            if (board[row][col] !== 0) {
              if (seen.has(board[row][col])) {
                conflicts.add(`${row},${col}`);
                conflicts.add(`${seen.get(board[row][col])}`);
              } else {
                seen.set(board[row][col], `${row},${col}`);
              }
            }
          }
        }
      }
    }
    
    return conflicts;
  }

  // 提示功能 - 填充一个随机空单元格
  getHint(board) {
    const emptyCells = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }
    
    if (emptyCells.length === 0) return null;
    
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    return {
      row: randomCell.row,
      col: randomCell.col,
      number: this.solution[randomCell.row][randomCell.col]
    };
  }
}

// 本地数独题库
const LOCAL_PUZZLES = [
  [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ],
  [
    [0, 0, 0, 2, 6, 0, 7, 0, 1],
    [6, 8, 0, 0, 7, 0, 0, 9, 0],
    [1, 9, 0, 0, 0, 4, 5, 0, 0],
    [8, 2, 0, 1, 0, 0, 0, 4, 0],
    [0, 0, 4, 6, 0, 2, 9, 0, 0],
    [0, 5, 0, 0, 0, 3, 0, 2, 8],
    [0, 0, 9, 3, 0, 0, 0, 7, 4],
    [0, 4, 0, 0, 5, 0, 0, 3, 6],
    [7, 0, 3, 0, 1, 8, 0, 0, 0]
  ]
];

module.exports = {
  SudokuGame,
  LOCAL_PUZZLES
};
