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
let boardSize = 10;
let winCount = 5;

// Initialize game
function initGame() {
    // Validate board size
    boardSize = parseInt(boardSizeInput.value);
    if (boardSize < 5 || boardSize > 19) {
        alert('棋盤大小必須在5到19之間');
        return;
    }
    
    // Validate win count
    winCount = parseInt(winCountInput.value);
    if (winCount < 3 || winCount > 10) {
        alert('勝負連線數必須在3到10之間');
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
    boardContainer.style.gridTemplateColumns = `repeat(${boardSize + 1}, 32px)`; // +1 for header row

    // Create header row for X coordinates
    // Empty corner cell
    const cornerCell = document.createElement('div');
    //cornerCell.className = 'cell coordinate';
    boardContainer.appendChild(cornerCell);

    // X coordinates (A, B, C...)
    for (let col = 0; col < boardSize; col++) {
        const headerCell = document.createElement('div');
        //headerCell.className = 'cell coordinate coordinate-x';
        headerCell.textContent = String.fromCharCode(65 + col); // A, B, C...
        boardContainer.appendChild(headerCell);
    }

    // Create cells
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col <= boardSize; col++) { // <= to include Y coordinates
            // Add Y coordinate for first column
            if (col === 0) {
                const cell = document.createElement('div');
                //cell.className = 'cell coordinate coordinate-y';
                cell.textContent = row + 1;
                boardContainer.appendChild(cell);
                continue;
            }
            
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col - 1; // Adjust for coordinate column

            // Highlight winning cells
            if (game.isGameOver() && game.winCells &&
                game.winCells.some(winCell => winCell.row === row && winCell.col === col - 1)) {
                cell.classList.add('win');
                
                // Determine win direction and add appropriate class
                if (game.winDirection) {
                    const { dx, dy } = game.winDirection;
                    if (dx === 0 && dy === 1) {
                        cell.classList.add('horizontal');
                    } else if (dx === 1 && dy === 0) {
                        cell.classList.add('vertical');
                    } else if (dx === 1 && dy === 1) {
                        cell.classList.add('diagonal1');
                    } else if (dx === 1 && dy === -1) {
                        cell.classList.add('diagonal2');
                    }
                }
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
            gameInfoElement.style.color = game.getWinner() === 1 ? '#f1c40f' : '#ecf0f1';
            gameInfoElement.style.textShadow = '0 0 10px rgba(241, 196, 15, 0.7)';
        } else {
            gameInfoElement.textContent = '平局！';
            gameInfoElement.style.color = '#f1c40f';
            gameInfoElement.style.textShadow = '0 0 10px rgba(241, 196, 15, 0.7)';
        }
    } else {
        gameInfoElement.textContent = `輪到玩家 ${game.getCurrentPlayer() === 1 ? '黑子' : '白子'}`;
        gameInfoElement.style.color = '#ecf0f1';
        gameInfoElement.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.5)';
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