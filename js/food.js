import { canvasContext } from './utils.js'

export default class Food {
    constructor () {
        this.postition = this.randomCoordinateGenerator();
        this.drawFood();
    }
    randomCoordinateGenerator() {
        let x = Math.floor(Math.random() * Math.floor(canvasContext.canvas.width-10)/10) * 10;
        let y = Math.floor(Math.random() * Math.floor(canvasContext.canvas.height-10)/10) * 10;
        if (x === 0) x += 10;
        if (y === 0) y += 10;
        return [x, y];
    }
    drawFood() {
        canvasContext.fillStyle = "red";
        canvasContext.fillRect(this.postition[0], this.postition[1], 8, 8)
    }
}