<script lang="ts">
    import Board from './lib/components/Board.svelte'
    import {type BoardType, getEmptyBoard} from './lib/board'
    import {getRandomBoard, getNextBoard} from './lib/board'
    import {onMount} from "svelte";

    const BOARD_SIZE = 300;
    let currentBoard: BoardType = getRandomBoard(BOARD_SIZE);
    let oldBoard: BoardType = getEmptyBoard(BOARD_SIZE);

    onMount(() => {
        // const worker = new Worker('worker.js');
        // let lastFinished = true;
        // worker.onmessage = (e) => {
        //     const {currentBoard: currBoard, oldBoard: oBoard} = e.data;
        //     const temp = currBoard;
        //     currentBoard = oBoard;
        //     oldBoard = temp;
        //     lastFinished = true;
        //     // currentBoard = e.data;
        // };
        // const interval = setInterval(() => {
        //     if (lastFinished) {
        //         lastFinished = false;
        //         worker.postMessage({currentBoard, oldBoard});
        //     }
        // }, 100);
        //
        // return () => clearInterval(interval);

        // requestAnimationFrame(() => {
        //     worker.postMessage({currentBoard, oldBoard});
        // });

        const interval = setInterval(() => {
            const nextBoard = getNextBoard(currentBoard, oldBoard);
            oldBoard = currentBoard;
            currentBoard = nextBoard;
        }, 1000);

        return () => clearInterval(interval);
    });
</script>

<main>
    <Board currentBoard={currentBoard}/>
</main>

<style>
    main {
        height: 100%;
    }
</style>
