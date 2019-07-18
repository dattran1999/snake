// global var
const canvas = document.getElementById("gameCanvas");
const canvasContext = canvas.getContext("2d");

function drawCanvas (ctx) {
    // Experimental: TODO: change canvas width and height to be the same as window's
    // ctx.canvas.width = window.innerWidth;
    // ctx.canvas.height = window.innerHeight;
    ctx.canvas.width = 400;
    ctx.canvas.height = 300;
    // console.log("width: ", window.innerWidth, "height: ", window.innerHeight);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    drawBorder(ctx);
}

// TODO: patition the box size to be responsive to window height + width
function drawBorder (ctx) {
    ctx.fillStyle = 'white';
    // draw 9x9px rectangles 1 px margin
    // left border
    for (let i = 0; i < ctx.canvas.height; i += 10){
        ctx.fillRect(1, i+1, 8, 8);
    }
    // right border
    for (let i = 0; i < ctx.canvas.height; i += 10){
        ctx.fillRect(ctx.canvas.width-9, i+1, 8, 8);
    }
    // top border
    for (let i = 0; i < ctx.canvas.width; i += 10){
        ctx.fillRect(i+1, 1, 8, 8);
    }
    // bottom border
    for (let i = 0; i < ctx.canvas.width; i += 10){
        ctx.fillRect(i+1, ctx.canvas.height-9, 8, 8);
    }
}


class Snake {
    constructor (x, y){
        this.dx = 0;
        this.dy = 10;
        this.headX = Math.floor(x/2);
        this.headY = Math.floor(y/2);
        this.body = [[this.headX, this.headY - 10], [this.headX, this.headY]];
        this.food = new Food();
        console.log(this.food.postition);
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
        let deleteBlock = undefined;
        if (this.headX === this.food.postition[0] && this.headY === this.food.postition[1]) {
            deleteBlock = null;
            this.food = new Food();
        } else {
            deleteBlock = this.body.shift(); 
        }
        this.body.push([this.headX, this.headY]);
        this.drawSnake(deleteBlock);
    }
    updateMovementDirection (dx, dy) {
        if ((this.dx === 0 && dx !== 0) || (this.dy === 0 && dy !== 0)){
            this.dx = dx;
            this.dy = dy;
        }
    }
    reset() {
        drawCanvas(canvasContext);
        this.dx = 0;
        this.dy = 10;
        this.headX = Math.floor(canvasContext.canvas.width/2);
        this.headY = Math.floor(canvasContext.canvas.height/2);
        this.body = [[this.headX, this.headY - 10], [this.headX, this.headY]];
        this.food = new Food();
    }
    loseCondition() {
        if (this.headX >= canvasContext.canvas.width - 10 || this.headX <= 0) {
            this.reset();
        }
        if (this.headY >= canvasContext.canvas.height - 10|| this.headY <= 0) {
            this.reset();
        }
    }
    collisionDetect() {
        for (let i = 0; i < this.body.length - 1; i++) {
            if (this.body[i][0] === this.headX && this.body[i][1] === this.headY) {
                this.reset();
            }
        }
    }
}
class Food {
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
window.onload = function() {
    drawCanvas(canvasContext);
    const snake = new Snake(canvasContext.canvas.width, canvasContext.canvas.height);
    
    const framesPerSecond = 10;
    setInterval(function() {
        snake.updatePosition();
        snake.collisionDetect();
        snake.loseCondition();
    }, 1000/framesPerSecond);
    document.addEventListener('keydown', function(event) {
        switch (event.code) {
            case 'ArrowRight':
                snake.updateMovementDirection(10, 0);
                break;
            case 'ArrowLeft':
                snake.updateMovementDirection(-10, 0);
                break;
            case 'ArrowUp':
                snake.updateMovementDirection(0, -10);
                break;
            case 'ArrowDown':
                snake.updateMovementDirection(0, 10);
                break;
        }
    });


    // redraw canvas if window is resized
    window.addEventListener('resize', () => {drawCanvas(canvasContext)});

}