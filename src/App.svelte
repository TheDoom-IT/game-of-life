<script lang="ts">
  import Board from "./lib/components/Board.svelte";
  import {
    type BoardType,
    getEmptyBoard,
    getRandomBoard,
    getNextBoard,
    cloneBoard,
  } from "./lib/board";
  import LeftPanel from "./lib/components/LeftPanel.svelte";
  import { SimulationStatus } from "./lib/status";
  import RightPanel from "./lib/components/RightPanel.svelte";
  import { onMount } from "svelte";
  import { rotatePattern, type Pattern } from "./lib/patterns";

  const BOARD_SIZE = 500;
  let currentCellSize = 5;

  let selectedPattern: Pattern | null = null;
  let generation = 0;
  let status: SimulationStatus = SimulationStatus.STOPPED;
  // let currentBoard: BoardType = getRandomBoard(BOARD_SIZE);
  let currentBoard: BoardType = getEmptyBoard(BOARD_SIZE);
  let boardSwap: BoardType = getEmptyBoard(BOARD_SIZE);
  let generationZeroBoard: BoardType = cloneBoard(currentBoard);
  let initialBoard: BoardType = cloneBoard(currentBoard);

  const toggleStatus = () => {
    switch (status) {
      case SimulationStatus.RUNNING:
        status = SimulationStatus.STOPPED;
        break;
      case SimulationStatus.STOPPED:
        if (generation === 0) {
          generationZeroBoard = cloneBoard(currentBoard);
        }
        status = SimulationStatus.RUNNING;
        break;
    }
  };

  const resetGenerations = () => {
    currentBoard = cloneBoard(generationZeroBoard);
    generation = 0;
  };

  const resetBoard = () => {
    currentBoard = cloneBoard(initialBoard);
    generation = 0;
  };

  let interval: number | null = null;
  $: {
    if (interval !== null) {
      clearInterval(interval);
    }
    if (status === SimulationStatus.RUNNING) {
      interval = setInterval(() => {
        const nextBoard = getNextBoard(currentBoard, boardSwap);
        boardSwap = currentBoard;
        currentBoard = nextBoard;
        generation++;
      }, 100);
    }
  }

  onMount(() => {
    window.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        toggleStatus();
      } else if (event.key === "Escape") {
        selectedPattern = null;
      } else if (event.key === "r") {
        if (selectedPattern) {
          selectedPattern.cells = rotatePattern(selectedPattern.cells);
        }
      }
    });
  });
</script>

<main>
  <LeftPanel
    {status}
    {generation}
    {resetBoard}
    {resetGenerations}
    {toggleStatus}
  />
  <Board {currentBoard} bind:currentCellSize {selectedPattern} />
  <RightPanel bind:selectedPattern />
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
