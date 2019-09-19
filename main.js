import { DFS, Hamilton } from './searcher.js'
import { drawCanvas, canvas, canvasContext } from './utils.js'

let score = 0;

window.onload = function() {
    drawCanvas(canvasContext);
    const scoreBoard = document.getElementById("score");
    scoreBoard.style.marginTop = canvas.height + 'px';
    // const snake = new Snake(canvasContext.canvas.width, canvasContext.canvas.height);
    const searcher = new Hamilton();
    const fps = 25;
    // TODO: add promise instead of this???
    setInterval(function() {
        // snake.updatePosition();
        // snake.loseCondition();
        searcher.search();
        score = searcher.snake.body.length;
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