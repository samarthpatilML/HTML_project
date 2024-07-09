document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 10;
    const board = document.getElementById('board');
    const rollDiceButton = document.getElementById('rollDice');
    const diceResult = document.getElementById('diceResult');

    const snakes = {
        16: 6,
        47: 26,
        49: 11,
        56: 53,
        62: 19,
        64: 60,
        87: 24,
        93: 73,
        95: 75,
        98: 78
    };

    const ladders = {
        1: 38,
        4: 14,
        9: 31,
        21: 42,
        28: 84,
        36: 44,
        51: 67,
        71: 91,
        80: 100
    };

    let playerPosition = 1;
    let playerElement;

    function createBoard() {
        for (let i = 0; i < boardSize * boardSize; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.textContent = i + 1;

            if (snakes[i + 1]) {
                tile.classList.add('snake');
            } else if (ladders[i + 1]) {
                tile.classList.add('ladder');
            }

            board.appendChild(tile);
        }

        playerElement = document.createElement('div');
        playerElement.classList.add('player');
        board.appendChild(playerElement);
        movePlayer(1);
    }

    function rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function movePlayer(position) {
        if (position > 100) {
            position = 100;
        }

        const row = Math.floor((position - 1) / boardSize);
        const col = (position - 1) % boardSize;
        const x = (row % 2 === 0) ? col * 60 + 30 : (boardSize - col - 1) * 60 + 30;
        const y = (boardSize - row - 1) * 60 + 30;

        playerElement.style.left = `${x}px`;
        playerElement.style.top = `${y}px`;
    }

    rollDiceButton.addEventListener('click', () => {
        const dice = rollDice();
        diceResult.textContent = `You rolled: ${dice}`;
        playerPosition += dice;

        if (playerPosition in snakes) {
            playerPosition = snakes[playerPosition];
        } else if (playerPosition in ladders) {
            playerPosition = ladders[playerPosition];
        }

        movePlayer(playerPosition);

        if (playerPosition === 100) {
            alert('You won!');
            playerPosition = 1;
            movePlayer(playerPosition);
        }
    });

    createBoard();
});