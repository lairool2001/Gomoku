// Gomoku Game Logic
export class Gomoku {
    constructor(size = 15, winCount = 5) {
        // Validate parameters
        if (size < 5 || size > 19) {
            throw new Error('棋盤大小必須在5到19之間');
        }
        if (winCount < 3 || winCount > Math.min(10, size)) {
            throw new Error('勝負連線數必須在3到' + Math.min(10, size) + '之間');
        }
        
        this.size = size;
        this.board = Array(size).fill(null).map(() => Array(size).fill(0));
        this.currentPlayer = 1; // 1 for black, 2 for white
        this.gameOver = false;
        this.winner = null;
        this.winCount = winCount;
        this.winCells = null;
        this.winDirection = null;
    }

    placeStone(row, col) {
        // Validate position
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
            return false;
        }
        
        if (this.gameOver || this.board[row][col] !== 0) {
            return false;
        }

        this.board[row][col] = this.currentPlayer;

        const winResult = this.checkWin(row, col);
        if (winResult) {
            this.gameOver = true;
            this.winner = this.currentPlayer;
            this.winCells = winResult.cells;
            this.winDirection = winResult.direction;
        } else if (this.isBoardFull()) {
            this.gameOver = true;
        } else {
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        }

        return true;
    }

    checkWin(row, col) {
        const player = this.board[row][col];
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal /
            [1, -1]   // diagonal \\
        ];

        for (let [dx, dy] of directions) {
            let count = 1; // count the current stone
            let winCells = [{ row: row, col: col }]; // store winning cells

            // Check in positive direction
            for (let i = 1; i < this.winCount; i++) {
                const r = row + dx * i;
                const c = col + dy * i;
                if (r >= 0 && r < this.size && c >= 0 && c < this.size && this.board[r][c] === player) {
                    count++;
                    winCells.push({ row: r, col: c });
                } else {
                    break;
                }
            }

            // Check in negative direction
            for (let i = 1; i < this.winCount; i++) {
                const r = row - dx * i;
                const c = col - dy * i;
                if (r >= 0 && r < this.size && c >= 0 && c < this.size && this.board[r][c] === player) {
                    count++;
                    winCells.push({ row: r, col: c });
                } else {
                    break;
                }
            }

            if (count >= this.winCount) {
                // Only keep the winning cells (remove extra cells if count > winCount)
                if (winCells.length > this.winCount) {
                    // Sort cells to keep only the consecutive ones
                    if (dx === 0 && dy === 1) { // horizontal
                        winCells.sort((a, b) => a.col - b.col);
                    } else if (dx === 1 && dy === 0) { // vertical
                        winCells.sort((a, b) => a.row - b.row);
                    } else if (dx === 1 && dy === 1) { // diagonal /
                        winCells.sort((a, b) => a.row - b.row);
                    } else if (dx === 1 && dy === -1) { // diagonal \\
                        winCells.sort((a, b) => a.row - b.row);
                    }
                    
                    // Keep only the first winCount cells
                    winCells = winCells.slice(0, this.winCount);
                }
                
                return {
                    cells: winCells,
                    direction: { dx, dy }
                };
            }
        }

        return null;
    }

    isBoardFull() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.board[row][col] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    getBoard() {
        return this.board;
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    isGameOver() {
        return this.gameOver;
    }

    getWinner() {
        return this.winner;
    }

    getWinDirection() {
        return this.winDirection;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Gomoku;
}