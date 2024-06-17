<script lang="ts">
  import type { Template } from "../templates";
  import { onMount } from "svelte";

  export let selectedTemplate: Template | null = null;
  export let currentCellSize: number;

  let position = { x: 0, y: 0 };
  let canvasEl: HTMLCanvasElement;

  $: templateWidth = selectedTemplate ? selectedTemplate.cells[0].length : 0;
  $: templateHeight = selectedTemplate ? selectedTemplate.cells.length : 0;
  $: width = templateWidth * currentCellSize;
  $: height = templateHeight * currentCellSize;

  const onMouseMove = (e: MouseEvent) => {
    position = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  $: drawOnCanvas = (context: CanvasRenderingContext2D, template: Template) => {
    context.canvas.width = width;
    context.canvas.height = height;
    context.fillStyle = "green";
    context.clearRect(0, 0, 1000, 1000);
    for (let i = 0; i < template.cells.length; i++) {
      for (let j = 0; j < template.cells[i].length; j++) {
        if (template.cells[i][j]) {
          context.fillRect(
            j * currentCellSize,
            i * currentCellSize,
            currentCellSize,
            currentCellSize,
          );
        }
      }
    }
  };

  $: {
    const context = canvasEl?.getContext("2d");
    if (context && selectedTemplate) {
      drawOnCanvas(context, selectedTemplate);
    }
  }

  onMount(() => {
    addEventListener("mousemove", onMouseMove);

    return () => {
      removeEventListener("mousemove", onMouseMove);
    };
  });
</script>

{#if selectedTemplate !== null}
  <span
    class="mouse-template"
    style={`left: ${position.x}px; top: ${position.y}px;`}
  >
    <canvas bind:this={canvasEl} />
  </span>
{/if}

<style>
  .mouse-template {
    position: fixed;
    pointer-events: none;
  }

  canvas {
    display: block;
  }
</style>
