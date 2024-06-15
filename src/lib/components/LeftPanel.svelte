<script lang="ts">
  import { SimulationStatus } from "../status";
  import ResizablePanel from "./ResizablePanel.svelte";

  export let status: SimulationStatus;
  const getButtonText = (status: string) => {
    switch (status) {
      case SimulationStatus.RUNNING:
        return "Stop";
      case SimulationStatus.STOPPED:
        return "Start";
    }
  };

  const toggleStatus = () => {
    switch (status) {
      case SimulationStatus.RUNNING:
        status = SimulationStatus.STOPPED;
        break;
      case SimulationStatus.STOPPED:
        status = SimulationStatus.RUNNING;
        break;
    }
  };
</script>

<ResizablePanel direction="to-right">
  <div class="container">
    <button on:click={toggleStatus}>{getButtonText(status)}</button>
    {#if status === SimulationStatus.RUNNING}
      <p>Simulation is running</p>
    {:else if status === SimulationStatus.STOPPED}
      <p>Simulation is stopped</p>
    {/if}
  </div>
</ResizablePanel>

<style>
  .container {
    padding: 1rem;
  }
</style>
