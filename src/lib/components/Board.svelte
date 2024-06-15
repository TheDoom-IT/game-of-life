<script lang="ts">
  import type { BoardType } from "../board";
  import { onMount } from "svelte";

  export let currentBoard: BoardType;

  // TODO: scroll factor may cause problem with full zooming out (e.g., 460 pixels width board turn into 450)
  const scrollFactor = 0.25;
  // some clicks may be considered as dragging,
  // drag takes place after a few mouse move events
  const dragLengthThreshold = 5;

  let boardDiv: HTMLDivElement;
  let canvasEl: HTMLCanvasElement;
  let drawStart = { x: 0, y: 0 };
  let prevMousePosition = { x: 0, y: 0 };
  let currentCellSize = 5;
  let mouseDragLength = 0;

  let frameId: number;

  const isLongDrag = () => mouseDragLength > dragLengthThreshold;

  onMount(() => {
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    const observer = new ResizeObserver(() => {
      const ctx = canvasEl.getContext("2d");
      if (!ctx) {
        return;
      }

      if (resizeTimeout === null) {
        // use timeout so that it doesn't resize too often
        resizeTimeout = setTimeout(() => {
          resizeContextToMatchDiv(ctx);
          resizeTimeout = null;
        }, 0);
      }
    });
    observer.observe(boardDiv);

    window.addEventListener("wheel", onWheel);
    // TODO: do we need to use requestAnimationFrame for drawing?
    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("wheel", onWheel);
      observer.unobserve(boardDiv);
    };
  });

  const setDrawStart = (newValue: { x: number; y: number }) => {
    newValue.x = Math.min(newValue.x, 0);
    newValue.y = Math.min(newValue.y, 0);

    const boardHeight = currentBoard.length * currentCellSize;
    const boardWidth = currentBoard[0].length * currentCellSize;

    const { width: canvasWidth, height: canvasHeight } =
      canvasEl.getBoundingClientRect();

    if (newValue.x + boardWidth < canvasWidth) {
      newValue.x = canvasWidth - boardWidth;
    }

    if (newValue.y + boardHeight < canvasHeight) {
      newValue.y = canvasHeight - boardHeight;
    }

    drawStart = newValue;
  };

  const resizeContextToMatchDiv = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = boardDiv.getBoundingClientRect();
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    // TODO: handle board position, scale etc. (board may be to small to render to fill a whole canvas)
  };

  const draw = () => {
    const ctx = canvasEl.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.fillStyle = "black";

    const width = canvasEl.width;
    const height = canvasEl.height;

    ctx.clearRect(0, 0, width, height);

    let i = 0;
    if (drawStart.x < 0) {
      i = Math.floor(-drawStart.x / currentCellSize);
    }

    for (; i < currentBoard.length; i++) {
      const cellX = drawStart.x + i * currentCellSize;
      if (cellX > width) {
        break;
      }

      let j = 0;
      if (drawStart.y < 0) {
        j = Math.floor(-drawStart.y / currentCellSize);
      }
      for (; j < currentBoard[i].length; j++) {
        const cellY = drawStart.y + j * currentCellSize;
        if (cellY > height) {
          break;
        }

        if (currentBoard[i][j] === 1) {
          ctx.fillRect(cellX, cellY, currentCellSize, currentCellSize);
        }
      }
    }

    frameId = requestAnimationFrame(draw);
  };

  const onWheel = (e: WheelEvent) => {
    if (e.deltaY == 0) {
      return;
    }

    const { top, left, right, bottom, width, height } =
      canvasEl.getBoundingClientRect();
    // TODO: check not outside of canvas but outside of board
    if (
      e.clientX < left ||
      e.clientX > right ||
      e.clientY < top ||
      e.clientY > bottom
    ) {
      return;
    }

    const sizeChange = Math.sign(e.deltaY) * scrollFactor;
    // check if cells width greater than 0
    if (sizeChange < 0 && currentCellSize + sizeChange <= 0) {
      return;
    }
    // cannot zoom out further than the canvas container
    const newCellSize = currentCellSize + sizeChange;
    const newBoardWidth = currentBoard[0].length * newCellSize;
    const newBoardHeight = currentBoard.length * newCellSize;
    if (newBoardWidth < width || newBoardHeight < height) {
      return;
    }

    const previousCellSize = currentCellSize;
    currentCellSize = newCellSize;

    const mouseXInCanvas = e.clientX - left;
    const mouseYInCanvas = e.clientY - top;

    const previousBoardWidth = currentBoard[0].length * previousCellSize;
    const previousBoardHeight = currentBoard.length * previousCellSize;

    const previousXFactor = (mouseXInCanvas - drawStart.x) / previousBoardWidth;
    const previousYFactor =
      (mouseYInCanvas - drawStart.y) / previousBoardHeight;

    setDrawStart({
      x: mouseXInCanvas - newBoardWidth * previousXFactor,
      y: mouseYInCanvas - newBoardHeight * previousYFactor,
    });
  };

  const onMouseMove = (e: MouseEvent) => {
    mouseDragLength += 1;

    if (mouseDragLength <= dragLengthThreshold) {
      return;
    }

    const mouseDiff = {
      x: e.clientX - prevMousePosition.x,
      y: e.clientY - prevMousePosition.y,
    };

    setDrawStart({
      x: drawStart.x + mouseDiff.x,
      y: drawStart.y + mouseDiff.y,
    });

    prevMousePosition = { x: e.clientX, y: e.clientY };
  };

  const onMouseDown = (e: MouseEvent) => {
    prevMousePosition = { x: e.clientX, y: e.clientY };
    window.addEventListener("mousemove", onMouseMove);
  };

  const stopDragging = () => {
    window.removeEventListener("mousemove", onMouseMove);
    mouseDragLength = 0;
  };

  const onCanvasClick = (e: MouseEvent) => {
    if (mouseDragLength > dragLengthThreshold) {
      return;
    }

    const { clientX: mouseX, clientY: mouseY } = e;

    const { left, top } = canvasEl.getBoundingClientRect();

    const mouseXInCanvas = mouseX - left;
    const mouseYInCanvas = mouseY - top;

    const cellX = Math.floor((mouseXInCanvas - drawStart.x) / currentCellSize);
    const cellY = Math.floor((mouseYInCanvas - drawStart.y) / currentCellSize);
    currentBoard[cellX][cellY] = currentBoard[cellX][cellY] === 1 ? 0 : 1;

    mouseDragLength = 0;
  };
</script>

<div id="board" bind:this={boardDiv}>
  <canvas
    class:drag-active={mouseDragLength > 5}
    bind:this={canvasEl}
    on:click={onCanvasClick}
    on:mousedown={onMouseDown}
    on:mouseup={stopDragging}
    on:mouseleave={stopDragging}
  />
</div>

<style>
  #board {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  canvas {
    display: block;
  }

  .drag-active {
    cursor: grabbing;
  }
</style>
