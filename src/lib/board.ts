export type BoardType = number[][];

export const getEmptyBoard = (size: number) => {
  const board: BoardType = new Array(size);
  for (let i = 0; i < size; i++) {
    board[i] = new Array(size);
  }
  return board;
};

export const getRandomBoard = (size: number) => {
  const board: BoardType = new Array(size);
  for (let i = 0; i < size; i++) {
    const row = new Array(size);
    for (let j = 0; j < size; j++) {
      row[j] = Number(Math.random() > 0.5);
    }
    board[i] = row;
  }
  return board;
};

export const getNextBoard = (currentBoard: BoardType, oldBoard: BoardType) => {
  for (let i = 0; i < currentBoard.length; i++) {
    for (let j = 0; j < currentBoard[i].length; j++) {
      const cell = currentBoard[i][j];
      const aliveNeighbours = [
        currentBoard[i - 1]?.[j - 1],
        currentBoard[i - 1]?.[j],
        currentBoard[i - 1]?.[j + 1],
        currentBoard[i]?.[j - 1],
        currentBoard[i]?.[j + 1],
        currentBoard[i + 1]?.[j - 1],
        currentBoard[i + 1]?.[j],
        currentBoard[i + 1]?.[j + 1],
      ].filter((cell: number | undefined) => cell === 1).length;

      if (cell === 1) {
        oldBoard[i][j] = Number(aliveNeighbours === 2 || aliveNeighbours === 3);
      } else {
        oldBoard[i][j] = Number(aliveNeighbours === 3);
      }
    }
  }
  return oldBoard;
};
