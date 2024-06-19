<script lang="ts">
  import type { BoardType } from "../board";
  import { onMount } from "svelte";
  import type { Pattern } from "../patterns";

  export let currentBoard: BoardType;

  const scrollFactor = 0.25;
  const animationLength = 60;
  // some clicks may be considered as dragging,
  // drag takes place after a few mouse move events
  const dragLengthThreshold = 5;
  let mouseDragLength = 0;
  $: isLongDrag = mouseDragLength > dragLengthThreshold;
  let boardDiv: HTMLDivElement;
  let canvasEl: HTMLCanvasElement;
  let boardPosition = { x: 0, y: 0 };
  let prevMousePosition = { x: 0, y: 0 };
  let mousePosition = { x: 0, y: 0 };
  let animationFrame = 0;
  let animationReversed = false;
  let frameId: number;

  export let currentCellSize: number;
  export let selectedPattern: Pattern | null = null;

  onMount(() => {
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    const observer = new ResizeObserver(() => {
      const ctx = canvasEl.getContext("2d");
      if (!ctx) {
        return;
      }

      if (resizeTimeout === null) {
        // use timeout so that it doesn't resize too often and does not freeze the browser
        resizeTimeout = setTimeout(() => {
          // make sure the canvas takes the whole div
          resizeContextToMatchDiv(ctx);
          resizeTimeout = null;
        }, 10);
      }
    });
    observer.observe(boardDiv);

    canvasEl.addEventListener("wheel", onWheel);
    window.addEventListener("mousemove", onMouseMove);
    // TODO: do we need to use requestAnimationFrame for drawing?
    //  we may use animation frames for animations only
    //  and draw the board when it is needed (e.g., on a different canvas)
    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      canvasEl.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousemove", onMouseMove);
      observer.unobserve(boardDiv);
    };
  });

  const setBoardPosition = (newValue: { x: number; y: number }) => {
    // prevent the board to start in the middle of the canvas
    newValue.x = Math.min(newValue.x, 0);
    newValue.y = Math.min(newValue.y, 0);

    const boardHeight = currentBoard.length * currentCellSize;
    const boardWidth = currentBoard[0].length * currentCellSize;

    const { width: canvasWidth, height: canvasHeight } =
      canvasEl.getBoundingClientRect();

    // prevent the board end to finish in the middle of the canvas
    if (newValue.x + boardWidth < canvasWidth) {
      newValue.x = canvasWidth - boardWidth;
    }

    if (newValue.y + boardHeight < canvasHeight) {
      newValue.y = canvasHeight - boardHeight;
    }

    boardPosition = newValue;
  };

  const resizeContextToMatchDiv = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = boardDiv.getBoundingClientRect();
    // canvas size uses integers
    // passing float values may cause empty lines on the sides of the canvas
    // to prevent that, we use ceil
    ctx.canvas.width = Math.ceil(width);
    ctx.canvas.height = Math.ceil(height);

    let boardWidth = currentBoard.length * currentCellSize;
    let boardHeight = currentBoard[0].length * currentCellSize;

    // current cell size should be changed, so that the board fits the canvas
    if (boardWidth < width || boardHeight < height) {
      currentCellSize = Math.max(
        width / currentBoard.length,
        height / currentBoard[0].length,
      );

      boardWidth = currentBoard.length * currentCellSize;
      boardHeight = currentBoard[0].length * currentCellSize;
    }

    // move the board whether it leaves empty space in the canvas (it should always fill the canvas)
    if (boardPosition.x + boardWidth < width) {
      boardPosition.x = width - boardWidth;
    }
    if (boardPosition.y + boardHeight < height) {
      boardPosition.y = height - boardHeight;
    }
  };

  const draw = () => {
    const ctx = canvasEl.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.fillStyle = "black";

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.clearRect(0, 0, width, height);

    let i = 0;
    if (boardPosition.x < 0) {
      i = Math.floor(-boardPosition.x / currentCellSize);
    }

    for (; i < currentBoard.length; i++) {
      const cellX = boardPosition.x + i * currentCellSize;
      if (cellX > width) {
        break;
      }

      let j = 0;
      if (boardPosition.y < 0) {
        j = Math.floor(-boardPosition.y / currentCellSize);
      }
      for (; j < currentBoard[i].length; j++) {
        const cellY = boardPosition.y + j * currentCellSize;
        if (cellY > height) {
          break;
        }

        if (currentBoard[i][j] === 1) {
          ctx.fillRect(cellX, cellY, currentCellSize, currentCellSize);
        }
      }
    }

    // progress animation
    if (!animationReversed) {
      animationFrame += 1;
      if (animationFrame === animationLength) {
        animationReversed = true;
      }
    } else {
      animationFrame -= 1;
      if (animationFrame === 0) {
        animationReversed = false;
      }
    }

    const color = 80 + (120 * animationFrame) / 60;
    ctx.fillStyle = `rgb(${color},${color},${color})`;
    const { left, top } = canvasEl.getBoundingClientRect();

    const mouseXInCanvas = mousePosition.x - left;
    const mouseYInCanvas = mousePosition.y - top;

    // animation selected cells
    if (selectedPattern) {
      for (let row = 0; row < selectedPattern.cells.length; row++) {
        const cellY =
          Math.floor((mouseYInCanvas - boardPosition.y) / currentCellSize) +
          row;
        for (
          let column = 0;
          column < selectedPattern.cells[row].length;
          column++
        ) {
          if (selectedPattern.cells[row][column] === 1) {
            const cellX =
              Math.floor((mouseXInCanvas - boardPosition.x) / currentCellSize) +
              column;
            ctx.fillRect(
              boardPosition.x + cellX * currentCellSize,
              boardPosition.y + cellY * currentCellSize,
              currentCellSize,
              currentCellSize,
            );
          }
        }
      }
    } else {
      // animation of the cell under the mouse
      const cellX = Math.floor(
        (mouseXInCanvas - boardPosition.x) / currentCellSize,
      );
      const cellY = Math.floor(
        (mouseYInCanvas - boardPosition.y) / currentCellSize,
      );
      if (
        cellX >= 0 &&
        cellX < currentBoard.length &&
        cellY >= 0 &&
        cellY < currentBoard[0].length
      ) {
        ctx.fillRect(
          boardPosition.x + cellX * currentCellSize,
          boardPosition.y + cellY * currentCellSize,
          currentCellSize,
          currentCellSize,
        );
      }
    }

    frameId = requestAnimationFrame(draw);
  };

  const onWheel = (e: WheelEvent) => {
    if (e.deltaY == 0) {
      return;
    }

    const { top, left, width, height } = canvasEl.getBoundingClientRect();

    // size change is proportional to the current cell size
    // so that the zooming is smooth (there is no feeling it slows down with a high zoom)
    const sizeChange =
      Math.sign(e.deltaY) * scrollFactor * currentCellSize * 0.1;

    // cell size cannot be less than 0
    if (sizeChange < 0 && currentCellSize + sizeChange <= 0) {
      return;
    }
    // cannot zoom out that far that the board is smaller than the canvas
    let newCellSize = currentCellSize + sizeChange;
    let newBoardWidth = currentBoard[0].length * newCellSize;
    let newBoardHeight = currentBoard.length * newCellSize;
    if (newBoardWidth < width || newBoardHeight < height) {
      // set the cell size so that the board fills the canvas
      newCellSize = Math.max(
        width / currentBoard[0].length,
        height / currentBoard.length,
      );

      newBoardWidth = currentBoard[0].length * newCellSize;
      newBoardHeight = currentBoard.length * newCellSize;
    }

    const previousCellSize = currentCellSize;
    currentCellSize = newCellSize;

    const mouseXInCanvas = e.clientX - left;
    const mouseYInCanvas = e.clientY - top;

    const previousBoardWidth = currentBoard[0].length * previousCellSize;
    const previousBoardHeight = currentBoard.length * previousCellSize;

    const previousXFactor =
      (mouseXInCanvas - boardPosition.x) / previousBoardWidth;
    const previousYFactor =
      (mouseYInCanvas - boardPosition.y) / previousBoardHeight;

    setBoardPosition({
      x: mouseXInCanvas - newBoardWidth * previousXFactor,
      y: mouseYInCanvas - newBoardHeight * previousYFactor,
    });
  };

  const onMouseMove = (e: MouseEvent) => {
    mousePosition = { x: e.clientX, y: e.clientY };
  };

  const moveBoardWithMouse = (e: MouseEvent) => {
    mouseDragLength += 1;

    if (!isLongDrag) {
      return;
    }

    const mouseDiff = {
      x: e.clientX - prevMousePosition.x,
      y: e.clientY - prevMousePosition.y,
    };

    setBoardPosition({
      x: boardPosition.x + mouseDiff.x,
      y: boardPosition.y + mouseDiff.y,
    });

    prevMousePosition = { x: e.clientX, y: e.clientY };
  };

  const onMouseDown = (e: MouseEvent) => {
    prevMousePosition = { x: e.clientX, y: e.clientY };
    window.addEventListener("mousemove", moveBoardWithMouse);
  };

  const onMouseUp = () => {
    window.removeEventListener("mousemove", moveBoardWithMouse);
    // do not stop dragging - it is stopped on click event
  };

  const onMouseLeave = () => {
    window.removeEventListener("mousemove", moveBoardWithMouse);
    // stop dragging
    mouseDragLength = 0;
  };

  const onCanvasClick = (e: MouseEvent) => {
    if (isLongDrag) {
      // stop dragging
      mouseDragLength = 0;
      return;
    }

    const { clientX: mouseX, clientY: mouseY } = e;

    const { left, top } = canvasEl.getBoundingClientRect();

    const mouseXInCanvas = mouseX - left;
    const mouseYInCanvas = mouseY - top;

    const cellX = Math.floor(
      (mouseXInCanvas - boardPosition.x) / currentCellSize,
    );
    const cellY = Math.floor(
      (mouseYInCanvas - boardPosition.y) / currentCellSize,
    );

    if (selectedPattern) {
      for (let row = 0; row < selectedPattern.cells.length; row++) {
        for (
          let column = 0;
          column < selectedPattern.cells[row].length;
          column++
        ) {
          if (
            cellY + row >= currentBoard.length ||
            cellX + column >= currentBoard[0].length
          ) {
            continue;
          }
          currentBoard[cellX + column][cellY + row] =
            selectedPattern.cells[row][column];
        }
      }
    } else {
      // toggle the cell
      currentBoard[cellX][cellY] = currentBoard[cellX][cellY] === 1 ? 0 : 1;
    }

    mouseDragLength = 0;
  };
</script>

<div id="board" bind:this={boardDiv}>
  <canvas
    class:drag-active={mouseDragLength > 5}
    bind:this={canvasEl}
    on:click={onCanvasClick}
    on:mousedown={onMouseDown}
    on:mouseup={onMouseUp}
    on:mouseleave={onMouseLeave}
  />
</div>

<style>
  #board {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .drag-active {
    cursor: grabbing;
  }
</style>
