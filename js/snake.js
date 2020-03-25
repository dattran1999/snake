import Food from './food.js'
import { canvasContext, drawCanvas } from './utils.js'

let score = 0;
export default class Snake {
    constructor (x, y){
        this.dx = 0;
        this.dy = 10;
        this.headX = Math.floor(x/2);
        this.headY = Math.floor(y/2);
        this.body = [[this.headX, this.headY - 10], [this.headX, this.headY]];
        this.food = new Food();
    }
    drawSnake(deleteBlock) {
        canvasContext.fillStyle = 'white';
        canvasContext.fillRect(this.body[this.body.length-1][0], this.body[this.body.length-1][1], 8, 8);
        canvasContext.fillStyle = 'black';
        if (deleteBlock) {
            canvasContext.fillRect(deleteBlock[0], deleteBlock[1], 8, 8);
        }
    }
    updatePosition () {
        this.headY += this.dy;
        this.headX += this.dx;
        // console.log("new head: ", this.headX, this.headY);
        
        let deleteBlock = undefined;
        this.body.push([this.headX, this.headY]);
        if (this.headX === this.food.postition[0] && this.headY === this.food.postition[1]) {
            score++;
            deleteBlock = null;
            while (!this._validFoodPosition()) 
                this.food = new Food();
        } else {
            deleteBlock = this.body.shift(); 
        }
        this.drawSnake(deleteBlock);
    }
    updateMovementDirection (dx, dy) {
        // if ((this.dx === 0 && dx !== 0) || (this.dy === 0 && dy !== 0)){
            this.dx = dx;
            this.dy = dy;
        // }
    }
    reset() {
        drawCanvas(canvasContext);
        score = 0;
        this.dx = 0;
        this.dy = 10;
        this.headX = Math.floor(canvasContext.canvas.width/2);
        this.headY = Math.floor(canvasContext.canvas.height/2);
        this.body = [[this.headX, this.headY - 10], [this.headX, this.headY]];
        this.food = new Food();
    }
    loseCondition() {
        // go out of bound 
        if (this.headX >= canvasContext.canvas.width - 10 || this.headX <= 0) {
            console.log("reseting with", [this.headX, this.headY]);
            
            this.reset();
        }
        if (this.headY >= canvasContext.canvas.height - 10|| this.headY <= 0) {
            console.log("reseting with", [this.headX, this.headY]);
            this.reset();
        }
        // hit itself
        for (let i = 0; i < this.body.length - 1; i++) {
            if (this.body[i][0] === this.headX && this.body[i][1] === this.headY) {
                this.reset();
            }
        }
    }

    _validFoodPosition() {
        for (let i = 0; i < this.body.length; i++) {
            if (this.food.postition[0] === this.body[i][0] && this.food.postition[1] === this.body[i][1]) {
                canvasContext.fillStyle = "white";
                canvasContext.fillRect(this.food.postition[0], this.food.postition[1], 8, 8)
                return false;
            }
        }
        return true;
    }
}