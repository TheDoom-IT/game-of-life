<script lang="ts">
  import Board from "./lib/components/Board.svelte";
  import {
    type BoardType,
    getEmptyBoard,
    getRandomBoard,
    getNextBoard,
  } from "./lib/board";
  import LeftPanel from "./lib/components/LeftPanel.svelte";
  import { SimulationStatus } from "./lib/status";
  import RightPanel from "./lib/components/RightPanel.svelte";
  import { onMount } from "svelte";
  import { rotateTemplate, type Template } from "./lib/templates";

  const BOARD_SIZE = 100;
  let currentCellSize = 5;

  let selectedTemplate: Template | null = null;
  let status: SimulationStatus = SimulationStatus.STOPPED;
  // let currentBoard: BoardType = getRandomBoard(BOARD_SIZE);
  let currentBoard: BoardType = getEmptyBoard(BOARD_SIZE);
  let oldBoard: BoardType = getEmptyBoard(BOARD_SIZE);

  let interval: number | null = null;
  $: {
    if (interval !== null) {
      clearInterval(interval);
    }
    if (status === SimulationStatus.RUNNING) {
      interval = setInterval(() => {
        const nextBoard = getNextBoard(currentBoard, oldBoard);
        oldBoard = currentBoard;
        currentBoard = nextBoard;
      }, 100);
    }
  }

  onMount(() => {
    window.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        status =
          status === SimulationStatus.RUNNING
            ? SimulationStatus.STOPPED
            : SimulationStatus.RUNNING;
      } else if (event.key === "Escape") {
        selectedTemplate = null;
      } else if (event.key === "r") {
        if (selectedTemplate) {
          selectedTemplate.cells = rotateTemplate(selectedTemplate.cells);
        }
      }
    });
  });
</script>

<main>
  <LeftPanel bind:status />
  <Board {currentBoard} bind:currentCellSize {selectedTemplate} />
  <RightPanel bind:selectedTemplate />
</main>

<!--TODO: style main properly-->
<style>
  main {
    /*display: flex;*/
    /*flex-direction: row;*/
    /*height: 100%;*/
    display: grid;
    grid-template-columns: auto auto auto;
    height: 100%;
  }
</style>
