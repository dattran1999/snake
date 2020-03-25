import { DFS, Hamilton } from './searcher.js'
import { drawCanvas, canvas, canvasContext } from './utils.js'

let score = 0;

window.onload = function() {
    drawCanvas(canvasContext);
    startGame();
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

function startGame() {
    const scoreBoard = document.getElementById("score");
    scoreBoard.style.marginTop = canvas.height + 'px';
    const searcher = new Hamilton();
    const fps = 25;
    setInterval(function() {
        searcher.search();
        scoreBoard.textContent = `Score: ${searcher.getSnakeLength()}`;
    }, 1000/fps);
}