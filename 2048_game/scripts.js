
document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 4;
    const board = [];
    let score = 0;

    function createBoard() {
        const boardElement = document.getElementById('board');
        for (let i = 0; i < boardSize * boardSize; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            boardElement.appendChild(tile);
            board.push(tile);
        }
        addNumber();
        addNumber();
        updateBoard();
    }

    function addNumber() {
        const emptyTiles = board.filter(tile => !tile.textContent);
        const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        randomTile.textContent = Math.random() < 0.9 ? 2 : 4;
    }

    function updateBoard() {
        board.forEach(tile => {
            const value = tile.textContent;
            tile.dataset.value = value ? value : 0;
        });
    }

    function moveTiles(direction) {
        let moved = false;

        function moveTile(fromIndex, toIndex) {
            if (!board[toIndex].textContent) {
                board[toIndex].textContent = board[fromIndex].textContent;
                board[fromIndex].textContent = '';
                moved = true;
            } else if (board[toIndex].textContent === board[fromIndex].textContent) {
                board[toIndex].textContent *= 2;
                score += parseInt(board[toIndex].textContent);
                board[fromIndex].textContent = '';
                moved = true;
            }
        }

        function traverse(direction) {
            for (let i = 0; i < boardSize * boardSize; i++) {
                let row = Math.floor(i / boardSize);
                let col = i % boardSize;
                let currentIndex = row * boardSize + col;
                let nextIndex;

                if (direction === 'up') nextIndex = (row - 1) * boardSize + col;
                if (direction === 'down') nextIndex = (row + 1) * boardSize + col;
                if (direction === 'left') nextIndex = row * boardSize + (col - 1);
                if (direction === 'right') nextIndex = row * boardSize + (col + 1);

                if (nextIndex >= 0 && nextIndex < boardSize * boardSize && !((direction === 'left' || direction === 'right') && Math.floor(nextIndex / boardSize) !== row)) {
                    moveTile(currentIndex, nextIndex);
                }
            }
        }

        if (direction === 'up' || direction === 'left') {
            for (let i = 0; i < boardSize - 1; i++) traverse(direction);
        } else {
            for (let i = boardSize - 1; i > 0; i--) traverse(direction);
        }

        if (moved) {
            addNumber();
            updateBoard();
        }
    }

    function control(e) {
        if (e.key === 'ArrowUp') moveTiles('up');
        if (e.key === 'ArrowDown') moveTiles('down');
        if (e.key === 'ArrowLeft') moveTiles('left');
        if (e.key === 'ArrowRight') moveTiles('right');
    }

    document.addEventListener('keydown', control);
    createBoard();
});