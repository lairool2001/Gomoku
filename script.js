// Import Gomoku class
import { Gomoku } from './gomoku.js';

// Get DOM elements
const boardElement = document.getElementById('board');
const gameInfoElement = document.getElementById('gameInfo');
const startBtn = document.getElementById('startBtn');
const boardSizeInput = document.getElementById('boardSize');
const winCountInput = document.getElementById('winCount');

// Game variables
let game;
let boardSize = 15;
let winCount = 5;

// Initialize game
function initGame() {
    boardSize = parseInt(boardSizeInput.value);
    if (boardSize < 3 || boardSize > 1000) {
        alert('棋盤大小必須在3到1000之間');
        return;
    }
    winCount = parseInt(winCountInput.value);
    if (winCount < 3 || winCount > 100) {
        alert('勝負連線數必須在3到100之間');
        return;
    }

    // Create new game instance
    game = new Gomoku(boardSize, winCount);
    renderBoard();
    updateGameInfo();
}

// Render game board
function renderBoard() {
    boardElement.innerHTML = '';
    const board = game.getBoard();

    // Create board container
    const boardContainer = document.createElement('div');
    boardContainer.style.display = 'grid';
    boardContainer.style.gridTemplateColumns = `repeat(${boardSize + 1}, 30px)`; // +1 for header row

    // Create header row for X coordinates
    // Empty corner cell
    const cornerCell = document.createElement('div');
    cornerCell.className = 'cell';
    cornerCell.style.visibility = 'hidden';
    boardContainer.appendChild(cornerCell);

    // X coordinates (A, B, C...)
    for (let col = 0; col < boardSize; col++) {
        const headerCell = document.createElement('div');
        headerCell.className = 'cell';
        headerCell.style.visibility = 'visible'; // Invisible cell for alignment
        headerCell.textContent = String.fromCharCode(65 + col); // A, B, C...
        headerCell.style.borderColor = "white"

        boardContainer.appendChild(headerCell);
    }

    // Create cells
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col <= boardSize; col++) { // <= to include Y coordinates
            // Add Y coordinate for first column
            const cell = document.createElement('div');
            if (col <= 1) {
                cell.className = 'cell';
                if (col === 0) {
                    cell.textContent = row + 1;
                    cell.style.borderColor = "white"
                    cell.style.visibility = 'visible';
                    boardContainer.appendChild(cell);
                    continue; // Skip the rest for coordinate cells
                } else {
                }
            }
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col - 1; // Adjust for coordinate column

            // Highlight winning cells
            if (game.isGameOver() && game.winCells &&
                game.winCells.some(cell => cell.row === row && cell.col === col - 1)) {
                cell.classList.add('win');
            }

            // Add stone if exists
            if (board[row][col - 1] !== 0) { // Adjust for coordinate column
                const stone = document.createElement('div');
                stone.className = `stone ${board[row][col - 1] === 1 ? 'black' : 'white'}`;
                cell.appendChild(stone);
                cell.classList.add('filled');
            }

            // Add click event
            cell.addEventListener('click', () => {
                if (!game.isGameOver() && board[row][col - 1] === 0) { // Adjust for coordinate column
                    game.placeStone(row, col - 1); // Adjust for coordinate column
                    renderBoard();
                    updateGameInfo();
                }
            });

            boardContainer.appendChild(cell);
        }
    }

    boardElement.appendChild(boardContainer);
}

// Update game info
function updateGameInfo() {
    if (game.isGameOver()) {
        if (game.getWinner()) {
            gameInfoElement.textContent = `玩家 ${game.getWinner() === 1 ? '黑子' : '白子'} 獲勝！`;
        } else {
            gameInfoElement.textContent = '平局！';
        }
    } else {
        gameInfoElement.textContent = `輪到玩家 ${game.getCurrentPlayer() === 1 ? '黑子' : '白子'}`;
    }
}

// Event listeners
startBtn.addEventListener('click', initGame);

// Initialize game on load
window.addEventListener('DOMContentLoaded', () => {
    // Set default board size
    boardSizeInput.value = boardSize;
    initGame();
});