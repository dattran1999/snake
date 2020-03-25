import { drawCanvas, canvas, canvasContext } from './utils.js'

export default class Game {
    constructor(searcher) {
        this.searcher = searcher;
        this.startGame();
        this.timeIntervalId;
    }
    /**
     * start the game
     */ 
    startGame() {
        drawCanvas(canvasContext);
        const scoreBoard = document.getElementById("score");
        scoreBoard.style.marginTop = canvas.height + 'px';
        const fps = 25;
        this.timeIntervalId = setInterval(() => {
            this.searcher.search();
            scoreBoard.textContent = `Score: ${this.searcher.getSnakeLength()}`;
        }, 1000/fps);
        console.log(this.timeIntervalId)
    }
    /**
     * endGame end the current game. NOTE: has to be called before a new game starts
     */
    endGame() {
        clearInterval(this.timeIntervalId);
        console.log("cleared " + this.timeIntervalId)
    }
}