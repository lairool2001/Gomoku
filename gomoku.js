// Gomoku Game Logic
export class Gomoku {
    constructor(size = 15, winCount = 5) {
        this.size = size;
        this.board = Array(size).fill(null).map(() => Array(size).fill(0));
        this.currentPlayer = 1; // 1 for black, 2 for white
        this.gameOver = false;
        this.winner = null;
        this.winCount = winCount;
    }

    placeStone(row, col) {
        if (this.gameOver || this.board[row][col] !== 0) {
            return false;
        }

        this.board[row][col] = this.currentPlayer;

        if (this.checkWin(row, col)) {
            this.gameOver = true;
            this.winner = this.currentPlayer;
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
            [0, 1],  // horizontal
            [1, 0],  // vertical
            [1, 1],  // diagonal /
            [1, -1]  // diagonal \\
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
                this.winCells = winCells; // store win cells for highlighting
                return true;
            }
        }

        return false;
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
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Gomoku;
}