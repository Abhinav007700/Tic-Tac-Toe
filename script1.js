// Game state
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let moveHistory = [];
let player1Wins = 0;
let player2Wins = 0;

// Define the sound file URLs for each player
const player1SoundUrl = "player1-sound.mp4";
const player2SoundUrl = "player2-sound.mp4";

// Create Audio objects for each player
const player1Sound = new Audio(player1SoundUrl);
const player2Sound = new Audio(player2SoundUrl);

// Winning combinations
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
];

// Function to handle cell clicks
function makeMove(cellIndex) {
        if (gameActive && currentPlayer === "X" && board[cellIndex] === "") {
            board[cellIndex] = currentPlayer;
            moveHistory.push(cellIndex);
        
            // Add the necessary CSS class to the cell text
            const cellText = document.createElement("span");
            cellText.classList.add("cell-text");
            cellText.innerText = currentPlayer;
        
            // Append the cell text to the cell element
            const cellElement = document.getElementsByClassName("cell")[cellIndex];
            cellElement.innerHTML = "";
            cellElement.appendChild(cellText);
        
            vibrateDevice();
            playSoundForPlayer(currentPlayer);
            checkResult();
            currentPlayer = (currentPlayer === "X") ? "O" : "X";
            if (currentPlayer === "O") {
                setTimeout(()=>{
                    makeComputerMove();
                }, 1000)
            }
        }
}

// Function to handle cell clicks
function makeMove(cellIndex) {
    if (gameActive && currentPlayer === "X" && board[cellIndex] === "") {
        board[cellIndex] = currentPlayer;
        moveHistory.push(cellIndex);

        // Add the necessary CSS class to the cell text
        const cellText = document.createElement("span");
        cellText.classList.add("cell-text");
        cellText.innerText = currentPlayer;

        // Append the cell text to the cell element
        const cellElement = document.getElementsByClassName("cell")[cellIndex];
        cellElement.innerHTML = "";
        cellElement.appendChild(cellText);

        vibrateDevice();
        playSoundForPlayer(currentPlayer);
        checkResult();
        currentPlayer = (currentPlayer === "X") ? "O" : "X";

        if (gameActive && currentPlayer === "O") {
            setTimeout(() => {
                makeComputerMove();
            }, 1000);
        }
    }
}

// Function to make a move for the computer
function makeComputerMove() {
    if (!gameActive) {
        return;
    }

    const bestMove = getBestMove();
    board[bestMove] = currentPlayer;
    moveHistory.push(bestMove);

    // Add the necessary CSS class to the cell text
    const cellText = document.createElement("span");
    cellText.classList.add("cell-text");
    cellText.innerText = currentPlayer;

    // Append the cell text to the cell element
    const cellElement = document.getElementsByClassName("cell")[bestMove];
    cellElement.innerHTML = "";
    cellElement.appendChild(cellText);

    vibrateDevice();
    playSoundForPlayer(currentPlayer);
    checkResult();
    currentPlayer = (currentPlayer === "O") ? "X" : "O";
}

// Function to check for a win or draw
function checkResult() {
    let isWin = false;
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
            isWin = true;
            gameActive = false;
            updateWinCount(board[a]);
            setTimeout(function() {
                alert(`Player ${board[a]} wins!`);
                resetGame();
            }, 500);
            break;
        }
    }

    if (!isWin && board.every(cell => cell !== "")) {
        gameActive = false;
        setTimeout(function() {
            alert("It's a draw!");
            resetGame();
        }, 100);
    }
}

// Function to get the best move for the computer using the minimax algorithm
function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
        // Simulate the current move
        board[i] = currentPlayer;
        const score = minimax(board, 0, false);
        // Undo the move
        board[i] = "";
        if (score > bestScore) {
            bestScore = score;
            bestMove = i;
        }
        }
    }
    return bestMove;
}


// Minimax algorithm
function minimax(board, depth, isMaximizingPlayer) {
    const scores = {
        X: -1,
        O: 1,
        draw: 0,
    };

    if (checkWinningCondition("X")) {
        return scores.X;
    } else if (checkWinningCondition("O")) {
        return scores.O;
    } else if (board.every(cell => cell !== "")) {
        return scores.draw;
    }

    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = currentPlayer;
            const score = minimax(board, depth + 1, false);
            board[i] = "";
            bestScore = Math.max(score, bestScore);
        }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = getOpponentPlayer();
            const score = minimax(board, depth + 1, true);
            board[i] = "";
            bestScore = Math.min(score, bestScore);
        }
        }
        return bestScore;
    }
}

function checkWinningCondition(player) {
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}
function getOpponentPlayer() {
    return currentPlayer === "X" ? "O" : "X";
}

// Function to vibrate the device
function vibrateDevice() {
    if ("vibrate" in navigator) {
        navigator.vibrate(1000); // Vibrate for 1000 milliseconds
    }
}

// Function to play sound for the current player
function playSoundForPlayer(player) {
    if (player === "X") {
        player1Sound.currentTime = 0; // Reset player 1 audio to the beginning
        player1Sound.play();
    } else {
        player2Sound.currentTime = 0; // Reset player 2 audio to the beginning
        player2Sound.play();
    }
}


// Function to update the win count for the player
function updateWinCount(player) {
    if (player === "X") {
        player1Wins++;
        document.getElementById("player1Wins").textContent = player1Wins+"/10";
    } 
    if (player === "O"){
        player2Wins++;
        document.getElementById("player2Wins").textContent = player2Wins+"/10";
    }

    if (player1Wins === 10) {
        alert("Player has won 10 matches!");
        resetGame();
    }

    if (player2Wins === 10) {
        alert("Computer has won 10 matches!");
        resetGame();
    }
}

// Function to reset the game
function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = false;
    moveHistory = [];
    const cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = "";
    }
}

// Function to start the game
function startGame() {
    gameActive = true;
    moveHistory = [];
    document.getElementById("player1Wins").textContent = player1Wins+"/10";
    document.getElementById("player2Wins").textContent = player2Wins+"/10";
}

// Function to go to the previous move
function prevMove() {
    if (gameActive && moveHistory.length >= 2) {
        for(let i=0; i<2; i++){
            let prevCellIndex = moveHistory.pop();
            console.log(prevCellIndex);
            board[prevCellIndex] = "";
            document.getElementsByClassName("cell")[prevCellIndex].innerText = "";
        }
        currentPlayer = "X";
    }
}