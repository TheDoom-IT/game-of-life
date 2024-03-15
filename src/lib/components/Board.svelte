<script lang="ts">
    import type {BoardType} from "../board";
    import {onMount} from "svelte";

    export let currentBoard: BoardType;

    // TODO: scroll factor may cause problem with full zooming out (e.g., 460 pixels width board turn into 450)
    const scrollFactor = 0.25;

    let boardDiv: HTMLDivElement;
    let canvasEl: HTMLCanvasElement;
    let drawStart = {x: 0, y: 0};
    let prevMousePosition = {x: 0, y: 0};
    let currentCellSize = 5;
    let isMouseDown = false;
    let isMouseDragging = false;

    const setDrawStart = (newValue: { x: number, y: number }) => {
        newValue.x = Math.min(newValue.x, 0)
        newValue.y = Math.min(newValue.y, 0)

        const boardHeight = currentBoard.length * currentCellSize;
        const boardWidth = currentBoard[0].length * currentCellSize;
        console.log(boardWidth)

        const {width: canvasWidth, height: canvasHeight} = canvasEl.getBoundingClientRect();

        if (newValue.x + boardWidth < canvasWidth) {
            newValue.x = canvasWidth - boardWidth;
        }

        if (newValue.y + boardHeight < canvasHeight) {
            newValue.y = canvasHeight - boardHeight;
        }

        drawStart = newValue;
    }

    const setDrawStartOld = (newValue: { x: number, y: number }) => {
        if (newValue.x > 0 || newValue.y > 0) {
            return;
        }

        const boardHeight = currentBoard.length * currentCellSize;
        const boardWidth = currentBoard[0].length * currentCellSize;

        const {width: canvasWidth, height: canvasHeight} = canvasEl.getBoundingClientRect();
        console.log(canvasWidth)
        console.log(newValue.x + boardWidth)

        if (newValue.x + boardWidth <= canvasWidth || newValue.y + boardHeight < canvasHeight) {
            return;
        }

        drawStart = newValue;
    }

    const resizeContextToMatchDiv = (ctx: CanvasRenderingContext2D) => {
        const {width, height} = boardDiv.getBoundingClientRect();
        ctx.canvas.width = width;
        ctx.canvas.height = height
    }

    const initCanvas = () => {
        const ctx = canvasEl.getContext('2d');
        if (!ctx) {
            console.warn("Failed to initialize canvas")
            return;
        }
        ctx.fillStyle = 'black';
        resizeContextToMatchDiv(ctx);
    }

    const draw = () => {
        const ctx = canvasEl.getContext('2d');
        if (!ctx) {
            return;
        }

        const {width, height} = boardDiv.getBoundingClientRect();

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < currentBoard.length; i++) {
            const cellX = drawStart.x + i * currentCellSize;
            // if (cellX + currentCellSize < 0) {
            //     continue;
            // }
            if (cellX > width) {
                break;
            }
            for (let j = 0; j < currentBoard[i].length; j++) {
                const cellY = drawStart.y + j * currentCellSize;
                // if (cellY + currentCellSize < 0) {
                //     continue;
                // }
                if (cellY > height) {
                    break;
                }
                if (currentBoard[i][j] === 1) {
                    ctx.fillRect(cellX, cellY, currentCellSize, currentCellSize);
                }
            }
        }

        requestAnimationFrame(draw);
    };

    const onWheel = (e: WheelEvent) => {
        if (e.deltaY == 0) {
            return;
        }

        const {top, left, right, bottom, width, height} = canvasEl.getBoundingClientRect();
        // TODO: check not outside of canvas but outside of board
        if (e.clientX < left || e.clientX > right || e.clientY < top || e.clientY > bottom) {
            return;
        }

        const sizeChange = Math.sign(e.deltaY) * scrollFactor;
        // check if cells width greater than 0
        if (sizeChange < 0 && currentCellSize + sizeChange <= 0) {
            return;
        }
        // cannot zoom out further than the canvas container
        const newCellSize = currentCellSize + sizeChange;
        const newBoardWidth = currentBoard[0].length * newCellSize;
        const newBoardHeight = currentBoard.length * newCellSize;
        if (newBoardWidth < width || newBoardHeight < height) {
            return;
        }

        const previousCellSize = currentCellSize;
        currentCellSize = newCellSize;

        const mouseXInCanvas = e.clientX - left;
        const mouseYInCanvas = e.clientY - top;

        const previousBoardWidth = currentBoard[0].length * previousCellSize;
        const previousBoardHeight = currentBoard.length * previousCellSize;

        const previousXFactor = (mouseXInCanvas - drawStart.x) / previousBoardWidth;
        const previousYFactor = (mouseYInCanvas - drawStart.y) / previousBoardHeight;


        setDrawStart({
            x: mouseXInCanvas - newBoardWidth * previousXFactor,
            y: mouseYInCanvas - newBoardHeight * previousYFactor
        })
        // drawStart.x = mouseXInCanvas - newBoardWidth * previousXFactor;
        // drawStart.y = mouseYInCanvas - newBoardHeight * previousYFactor;
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isMouseDown) {
            return;
        }
        isMouseDragging = true;

        const mouseDiff = {x: e.clientX - prevMousePosition.x, y: e.clientY - prevMousePosition.y};
        setDrawStart({
            x: drawStart.x + mouseDiff.x,
            y: drawStart.y + mouseDiff.y
        })
        // drawStart.x += mouseDiff.x;
        // drawStart.y += mouseDiff.y;

        prevMousePosition = {x: e.clientX, y: e.clientY};
    }

    const onMouseDown = (e: MouseEvent) => {
        isMouseDown = true;
        prevMousePosition = {x: e.clientX, y: e.clientY};
    }

    const onMouseLeave = (e: MouseEvent) => {
        isMouseDown = false;
    }

    const onMouseUp = (e: MouseEvent) => {
        isMouseDown = false;
    }

    const onCanvasClick = (e: MouseEvent) => {
        isMouseDragging = false;
    }

    const onResize = (e: UIEvent) => {
        const ctx = canvasEl.getContext('2d');
        if (!ctx) {
            return;
        }
        resizeContextToMatchDiv(ctx);
    }

    onMount(() => {
        window.addEventListener('wheel', onWheel);
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('resize', onResize)
        }
    })

    onMount(() => {
        initCanvas();
        requestAnimationFrame(draw);
    })

</script>

<div id="board" bind:this={boardDiv}>
    <canvas
            bind:this={canvasEl}
            on:click={onCanvasClick}
            on:mousedown={onMouseDown}
            on:mouseup={onMouseUp}
            on:mouseleave={onMouseLeave}/>
</div>

<style>
    #board {
        height: 100%;
    }

    canvas {
        display: block;
        border-width: 1px;
        border-style: solid;
    }
</style>
