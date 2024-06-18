<script lang="ts">
  import ResizablePanel from "./ResizablePanel.svelte";
  import { type Template, templates } from "../templates";
  import TemplateTile from "./TemplateTile.svelte";

  export let selectedTemplate: Template | null = null;

  const selectTemplate = (template: Template) => {
    if (selectedTemplate?.name === template.name) {
      selectedTemplate = null;
      return;
    }

    // copy object to avoid mutating the original template during rotation
    selectedTemplate = {
      ...template,
    };
  };
</script>

<ResizablePanel direction="to-left">
  <div class="content">
    <h3 class="title">Templates</h3>
    {#each templates as templateGroup}
      <h4 class="text-divider group-name">{templateGroup.name}</h4>
      {#each templateGroup.templates as template}
        <TemplateTile onClick={() => selectTemplate(template)} {template} />
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
