<script lang="ts">
  import ResizablePanel from "./ResizablePanel.svelte";
  import { type Template, templates } from "../templates";
  import TemplateTile from "./TemplateTile.svelte";

  export let selectedTemplate: Template | null = null;

  const selectTemplate = (template: Template) => {
    if (selectedTemplate === template) {
      selectedTemplate = null;
      return;
    }

    selectedTemplate = template;
  };
</script>

<ResizablePanel direction="to-left">
  <div class="content">
    <h3 class="title">Templates</h3>
    {#each templates as template}
      <TemplateTile onClick={() => selectTemplate(template)} {template} />
    {/each}
  </div>
</ResizablePanel>

<style>
  .title {
    text-align: center;
  }

  .content {
    padding: 1rem;
  }
</style>
