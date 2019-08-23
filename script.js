import { DFS, Hamilton } from './searcher.js'
import { drawCanvas } from './utils.js'
// TODO: move these var to utils.js
// global var
const canvas = document.getElementById("gameCanvas");
const canvasContext = canvas.getContext("2d");
let score = 0;

window.onload = function() {
    drawCanvas(canvasContext);
    const scoreBoard = document.getElementById("score");
    scoreBoard.style.marginTop = canvas.height + 'px';
    // const snake = new Snake(canvasContext.canvas.width, canvasContext.canvas.height);
    const searcher = new Hamilton();
    const fps = 50;
    // TODO: add promise instead of this???
    setInterval(function() {
        // snake.updatePosition();
        // snake.loseCondition();
        searcher.search();
        scoreBoard.textContent = `Score: ${score}`;
    }, 1000/fps);
    document.addEventListener('keydown', function(event) {
        switch (event.code) {
            case 'ArrowRight':
                searcher.snake.updateMovementDirection(10, 0);
                break;
            case 'ArrowLeft':
                searcher.snake.updateMovementDirection(-10, 0);
                break;
            case 'ArrowUp':
                searcher.snake.updateMovementDirection(0, -10);
                break;
            case 'ArrowDown':
                searcher.snake.updateMovementDirection(0, 10);
                break;
        }
    });

    // redraw canvas if window is resized
    window.addEventListener('resize', () => {drawCanvas(canvasContext)});

}