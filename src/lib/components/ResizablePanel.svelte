<script lang="ts">
  import HorizontalResizer from "./HorizontalResizer.svelte";
  import { onMount } from "svelte";

  export let direction: "to-left" | "to-right" = "to-left";

  const getCurrentMinWidth = () => window.innerWidth * 0.1;
  const getCurrentMaxWidth = () => window.innerWidth * 0.3;

  let currentWidth: number = window.innerWidth * 0.12;
  let minWidth = getCurrentMinWidth();
  let maxWidth = getCurrentMaxWidth();

  onMount(() => {
    const onResize = () => {
      minWidth = getCurrentMinWidth();
      maxWidth = getCurrentMaxWidth();
      if (currentWidth < minWidth) {
        currentWidth = minWidth;
      } else if (currentWidth > maxWidth) {
        currentWidth = maxWidth;
      }
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });
</script>

<aside style="width: {currentWidth}px">
  {#if direction === "to-left"}
    <HorizontalResizer
      bind:currentWidth
      {minWidth}
      {maxWidth}
      direction="to-left"
    />
  {/if}
  <div class="content">
    <slot />
  </div>
  {#if direction === "to-right"}
    <HorizontalResizer
      bind:currentWidth
      {minWidth}
      {maxWidth}
      direction="to-right"
    />
  {/if}
</aside>

<style>
  aside {
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }

  .content {
    width: calc(100% - var(--resizer-width));
    overflow: auto;
  }
</style>
