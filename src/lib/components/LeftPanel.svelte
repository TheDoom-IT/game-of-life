<script lang="ts">
  import { SimulationStatus } from "../status";
  import ResizablePanel from "./ResizablePanel.svelte";

  export let generation: number;
  export let status: SimulationStatus;
  export let resetGenerations: () => void;
  export let resetBoard: () => void;
  export let toggleStatus: (newStatus: SimulationStatus) => void;

  const getButtonText = (status: string) => {
    switch (status) {
      case SimulationStatus.RUNNING:
        return "Stop";
      case SimulationStatus.STOPPED:
        return "Start";
    }
  };
</script>

<ResizablePanel direction="to-right">
  <div class="container">
    <div>
      <h4 class="text-divider">Shortcuts</h4>
      <div class="shortcuts-list">
        <div class="shortcut">
          <div class="keyboard-button">Spacebar</div>
          <div class="text-center">Start/Stop</div>
        </div>
        <div class="shortcut">
          <div class="keyboard-button square-button">
            <div>Esc</div>
          </div>
          <div class="text-center">Unselect template</div>
        </div>
        <div class="shortcut">
          <div class="keyboard-button square-button">
            <div>R</div>
          </div>
          <div class="text-center">Rotate template</div>
        </div>
      </div>
    </div>
    <div>
      <h4 class="text-divider">Menu</h4>
      <div class="menu">
        <button class="start-button" on:click={toggleStatus}
          >{getButtonText(status)}</button
        >
        <p>Generation: {generation}</p>
        <button class="button" on:click={resetGenerations}
          >Reset generations</button
        >
        <button class="button" on:click={resetBoard}>Reset board</button>
      </div>
    </div>
  </div>
</ResizablePanel>

<style>
  .button {
    width: 50%;
    min-width: 100px;
    min-height: 30px;
    margin: 0.25rem;
  }

  .start-button {
    width: 100%;
    min-width: 100px;
    min-height: 30px;
    padding: 0.5rem 1rem;
    font-size: 1.2rem;
  }

  .container {
    box-sizing: border-box;
    height: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .menu {
    padding: 1rem 0;
    display: flex;
    gap: 0.2rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .shortcuts-list {
    padding: 1rem 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .shortcut {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.2rem;
  }

  .keyboard-button {
    background-color: #484848;
    border-radius: 5px;
    padding: 0.3rem;
    text-align: center;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .square-button {
    aspect-ratio: 1 / 1;
  }

  .text-center {
    text-align: center;
  }
</style>
