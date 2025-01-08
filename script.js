const cells = document.querySelectorAll('.cell');
const messageDisplay = document.getElementById('message');
const restartBtn = document.getElementById('restart');
const humanVsHumanBtn = document.getElementById('human-vs-human');
const humanVsBotBtn = document.getElementById('human-vs-bot');
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let mode = 'human-vs-human'; 
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function startGame() {
    gameActive = true;
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.addEventListener('click', handleCellClick);
    });
    messageDisplay.textContent = `C'est au tour de ${currentPlayer}`;
    restartBtn.style.display = 'none';
}

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');

    if (board[index] !== '' || !gameActive) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (checkWin()) {
        messageDisplay.textContent = `${currentPlayer} a gagné !`;
        gameActive = false;
        restartBtn.style.display = 'block';
    } else if (board.every(cell => cell !== '')) {
        messageDisplay.textContent = 'Match nul !';
        gameActive = false;
        restartBtn.style.display = 'block';
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        messageDisplay.textContent = `C'est au tour de ${currentPlayer}`;

        if (mode === 'human-vs-bot' && currentPlayer === 'O' && gameActive) {
            setTimeout(botMove, 500); 
        }
    }
}

function checkWin() {
    return winConditions.some(combination => {
        return combination.every(index => board[index] === currentPlayer);
    });
}

function botMove() {
    let availableCells = board.map((val, index) => val === '' ? index : null).filter(val => val !== null);

    let move = findBestMove('O');
    if (move === null) {
        move = findBestMove('X');
    }
    
    if (move === null) {
        move = availableCells[Math.floor(Math.random() * availableCells.length)];
    }
    
    board[move] = 'O';
    cells[move].textContent = 'O';
    
    if (checkWin()) {
        messageDisplay.textContent = `O a gagné !`;
        gameActive = false;
        restartBtn.style.display = 'block';
    } else if (board.every(cell => cell !== '')) {
        messageDisplay.textContent = 'Match nul !';
        gameActive = false;
        restartBtn.style.display = 'block';
    } else {
        currentPlayer = 'X';
        messageDisplay.textContent = `C'est au tour de ${currentPlayer}`;
    }
}

function findBestMove(player) {
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] === player && board[b] === player && board[c] === '') return c;
        if (board[a] === player && board[c] === player && board[b] === '') return b;
        if (board[b] === player && board[c] === player && board[a] === '') return a;
    }
    return null;
}

// Mode selection
humanVsHumanBtn.addEventListener('click', () => {
    mode = 'human-vs-human';
    startGame();
});

humanVsBotBtn.addEventListener('click', () => {
    mode = 'human-vs-bot';
    startGame();
});

// Restart game
restartBtn.addEventListener('click', startGame);

// Start the game on page load
startGame();
