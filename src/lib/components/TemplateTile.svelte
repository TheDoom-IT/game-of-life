<script lang="ts">
  import type { Template } from "../templates";
  import { onMount } from "svelte";

  export let template: Template;
  export let onClick: () => void;

  let divEl: HTMLDivElement;
  let canvasEl: HTMLCanvasElement;

  const draw = (context: CanvasRenderingContext2D) => {
    const { width, height } = divEl.getBoundingClientRect();
    context.canvas.width = width;
    context.canvas.height = height;
    context.fillStyle = "green";
    context.strokeStyle = "white";
    context.lineWidth = 1;

    const rows = template.cells.length;
    const columns = template.cells[0].length;
    let canvasRows = rows;
    let canvasColumns = columns;

    let cellSize;
    if (rows > columns) {
      canvasColumns = columns + 2;
      cellSize = width / (columns + 2);
    } else if (rows < columns) {
      canvasRows = rows + 2;
      cellSize = width / (rows + 2);
    } else {
      canvasRows = rows + 2;
      canvasColumns = columns + 2;
      cellSize = width / (rows + 2);
    }

    let iShift = 0;
    let jShift = 0;
    if (rows > columns) {
      jShift = 1;
    } else if (columns > rows) {
      iShift = 1;
    } else {
      iShift = 1;
      jShift = 1;
    }

    context.clearRect(0, 0, width, height);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (template.cells[i][j]) {
          context.fillRect(
            (j + jShift) * cellSize,
            (i + iShift) * cellSize,
            cellSize,
            cellSize,
          );
        }
      }
    }

    for (let i = 0; i < canvasRows; i++) {
      context.beginPath();
      context.moveTo(0, (i + 1) * cellSize);
      context.lineTo(width, (i + 1) * cellSize);
      context.stroke();
      for (let j = 0; j < canvasColumns; j++) {
        context.beginPath();
        context.moveTo((j + 1) * cellSize, 0);
        context.lineTo((j + 1) * cellSize, height);
        context.stroke();
      }
    }
  };

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
          draw(ctx);
          resizeTimeout = null;
        }, 10);
      }
    });
    observer.observe(divEl);

    return () => {
      observer.unobserve(divEl);
    };
  });
</script>

<div class="template-container">
  <h5 class="template-name">
    {template.name}
  </h5>
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="bordered-container" on:click={onClick}>
    <div class="canvas-container" bind:this={divEl}>
      <canvas bind:this={canvasEl} />
    </div>
  </div>
</div>

<style>
  .template-name {
    text-align: center;
    margin: 0;
    padding: 5px;
  }

  .template-container {
    margin-bottom: 1rem;
  }

  .template-container:last-of-type {
    margin-bottom: 0;
  }

  .bordered-container {
    box-sizing: border-box;
    border-style: solid;
    border-width: 3px;
    cursor: pointer;
  }

  .canvas-container {
    aspect-ratio: 1 / 1;
    overflow: hidden;
  }

  canvas {
    display: block;
  }
</style>
