onmessage = async (e) => {
    const {currentBoard, oldBoard} = e.data;
    await getNextBoard(currentBoard, oldBoard);

    postMessage({currentBoard, oldBoard});
}

const getNextBoardStep = (currentBoard, oldBoard, callback) => {
    const itemsPerStep = Math.floor(currentBoard.length / 10);

    const step = (start) => {
        const max = Math.min(start + itemsPerStep, currentBoard.length);
        for (let i = start; i < max; i++) {
            for (let j = 0; j < currentBoard[i].length; j++) {
                const cell = currentBoard[i][j]
                const aliveNeighbours = [
                    currentBoard[i - 1]?.[j - 1],
                    currentBoard[i - 1]?.[j],
                    currentBoard[i - 1]?.[j + 1],
                    currentBoard[i]?.[j - 1],
                    currentBoard[i]?.[j + 1],
                    currentBoard[i + 1]?.[j - 1],
                    currentBoard[i + 1]?.[j],
                    currentBoard[i + 1]?.[j + 1]
                ].filter((cell) => cell === 1).length

                if (cell === 1) {
                    oldBoard[i][j] = Number(aliveNeighbours === 2 || aliveNeighbours === 3)
                } else {
                    oldBoard[i][j] = Number(aliveNeighbours === 3)
                }
            }
        }
        if (max === currentBoard.length) {
            callback();
            return;
        }
        setTimeout(() => step(max), 10);
    }

    step(0);
}

const getNextBoard = async (currentBoard, oldBoard) => {
    return new Promise((res) => {
        getNextBoardStep(currentBoard, oldBoard, res);
    })
}
