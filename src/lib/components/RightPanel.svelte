<script lang="ts">
  import ResizablePanel from "./ResizablePanel.svelte";
  import { type Pattern, patterns } from "../patterns";
  import PatternTile from "./PatternTile.svelte";

  export let selectedPattern: Pattern | null = null;

  const selectPattern = (pattern: Pattern) => {
    if (selectedPattern?.name === pattern.name) {
      selectedPattern = null;
      return;
    }

    // copy object to avoid mutating the original pattern during rotation
    selectedPattern = {
      ...pattern,
    };
  };
</script>

<ResizablePanel direction="to-left">
  <div class="content">
    <h3 class="title">Patterns</h3>
    {#each patterns as patternGroup}
      <h4 class="text-divider group-name">{patternGroup.name}</h4>
      {#each patternGroup.patterns as pattern}
        <PatternTile onClick={() => selectPattern(pattern)} {pattern} />
      {/each}
    {/each}
  </div>
</ResizablePanel>

<style>
  .title {
    text-align: center;
  }

  .group-name {
    margin: 50px 0 0 0;
  }

  .group-name:first-of-type {
    margin: 0;
  }

  .content {
    padding: 1rem;
  }
</style>
