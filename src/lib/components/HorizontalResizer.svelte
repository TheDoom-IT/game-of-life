<script lang="ts">
  export let currentWidth: number;
  export let minWidth: number;
  export let maxWidth: number;
  export let direction: "to-left" | "to-right";

  const onMouseDown = (event: MouseEvent) => {
    const initialWidth = currentWidth;
    const initialX = event.clientX;

    const onMouseMove = (event: MouseEvent) => {
      const diff = event.clientX - initialX;
      if (direction === "to-left") {
        currentWidth = initialWidth - diff;
      } else {
        currentWidth = initialWidth + diff;
      }
      if (currentWidth < minWidth) {
        currentWidth = minWidth;
      } else if (currentWidth > maxWidth) {
        currentWidth = maxWidth;
      }
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
  class="resizer"
  class:resize-to-left={direction === "to-left"}
  class:resize-to-right={direction === "to-right"}
  role="separator"
  on:mousedown={onMouseDown}
></div>

<style>
  .resizer {
    cursor: grab;
    min-width: var(--resizer-width);
    box-sizing: border-box;

    border-left-style: solid;
    border-right-style: solid;
    border-color: black;

    --wider-line-width: 6px;
    --narrower-line-width: 2px;
  }

  .resize-to-left {
    border-left-width: var(--wider-line-width);
    border-right-width: var(--narrower-line-width);
  }

  .resize-to-right {
    border-right-width: var(--wider-line-width);
    border-left-width: var(--narrower-line-width);
  }
</style>
