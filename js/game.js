import Snake from './snake.js';

export default class Game {
    constructor(searcher) {
        this.searcher = searcher;
        this.snake = new Snake(canvasContext.canvas.width, canvasContext.canvas.height);
        this.score = 0;
    }
    
}