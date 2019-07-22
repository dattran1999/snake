// global var
const canvas = document.getElementById("gameCanvas");
const canvasContext = canvas.getContext("2d");
let score = 0;

function drawCanvas (ctx) {
    // Experimental: TODO: change canvas width and height to be the same as window's
    // ctx.canvas.width = window.innerWidth;
    // ctx.canvas.height = window.innerHeight;
    ctx.canvas.width = 200;
    ctx.canvas.height = 200;
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
class Searcher {
    constructor() {
        this.snake = new Snake(canvasContext.canvas.width, canvasContext.canvas.height);      
    }
    findLegalMoves(startX, startY) {
        let moves = 
                    [ 
                        [startX + 10, startY], 
                        [startX - 10, startY], 
                        [startX, startY + 10], 
                        [startX, startY - 10]
                    ];
        moves = moves.filter((move) => {
            let illegal = false;
            if (move[0] >= canvas.width || move[0] <= 0
                || move[1] >= canvas.height || move[1] <= 0) {
                illegal = true;
            }
            this.snake.body.forEach(element => {
                if (element[0] === move[0] && element[1] === move[1]) {
                    illegal = true;
                }
            });
            if (!illegal) return move;
        });
        return moves;
    }
    computeDistance(moves, foodPosition) {
        let distance = [];
        moves.forEach(move => {
            /* if moves have the same x or y coordinate as food, and snake is moving away from food, 
             * min dist is still moving away */
            distance.push(Math.abs(foodPosition[0] - move[0]) + Math.abs(foodPosition[1] - move[1]));
            
        });
        return distance;
    }
}

class Hamilton extends Searcher {
    // search for way to reach the food by building a hamilton cycle
    search() {
        // find a path which has length snake body length + 1
        // path search is implemented by DFS
        // TODO: implement as an object and free it after each call
        let stack = [];
        this.seen = new Array(canvas.width/10).fill(false).map(() => new Array(canvas.height/10).fill(false));
        let seen = this.seen;
        // console.log(seen);
        console.log("start from: ", this.snake.headX, this.snake.headY);
        console.log("food at: ", this.snake.food.postition)
        // add some moves to the stack first
        let moves = this.findLegalMoves(this.snake.headX, this.snake.headY);
        let distance = this.computeDistance(moves, this.snake.food.postition);
        
        for (let i = 0; i < distance.length; i++) {
            // find max index
            let maxIndex = distance.indexOf(Math.max(...distance));
            // push on stack (expand last)
            stack.push(moves[maxIndex]);
            distance[maxIndex] = -1;
        }
        let pathLength = 1;
        const snakeLength = this.snake.body.length;
        let path = [];
        // TODO: find the length of the path
        while (stack.length > 0) {
            // console.log("stack: ", stack);
            // expand the stack
            const currMove = stack.pop();
            path.push(currMove);
            pathLength++;
            // console.log(currMove, this.snake.food.postition);
            
            // check if we've reach the food
            if (currMove[0] === this.snake.food.postition[0] && currMove[1] === this.snake.food.postition[1]) {
                console.log("reached food");
                
                if (pathLength > snakeLength) {
                    console.log(`road to food: ${pathLength}, was less than snake length ${snakeLength}`);
                    break;
                } else {
                    // dont expand on node that go pass the food and less than length of snake
                    pathLength--;
                    path.pop();
                    continue;
                }
            }
            let moves = this.findLegalMoves(currMove[0], currMove[1]);
            if (moves === null) {
                pathLength--;
                path.pop();
                continue;
            }
            let distance = this.computeDistance(moves, this.snake.food.postition);

            let addedMove = false;
            for (let i = 0; i < distance.length; i++) {
                // find max index
                let maxIndex = distance.indexOf(Math.max(...distance));
                // if current move is not seen                
                if (!seen[Number(moves[maxIndex][0]/10)][Number(moves[maxIndex][1]/10)]) {
                    // push on stack
                    stack.push(moves[maxIndex]);
                    seen[Number(moves[maxIndex][0]/10)][Number(moves[maxIndex][1]/10)] = true;
                    addedMove = true;
                    // console.log("pushing moves: ", moves[maxIndex]);
                }
                distance[maxIndex] = -1;    
            }
            // node was dead end
            if (!addedMove) {
                pathLength--;
                path.pop();
            }

        }
        this.drawSnake(path);
        stack = null;
        delete this.seen;
    }
    drawSnake(path) {
        console.log("path to food: ", path);
        for (let i = 0; i < path.length; i++) {
            // console.log(`${path[i][0]} - ${path[i-1][0]} = ${path[i][0] - path[i-1][0]}, ${path[i][1]} - ${path[i-1][1]} = ${path[i][1] - path[i-1][1]}`);
            // console.log(`${path[i][0]} - ${this.snake.headX} = ${path[i][0] - this.snake.headX}, ${path[i][1]} - ${this.snake.headY} = ${path[i][1] - this.snake.headY}`);
            this.snake.updateMovementDirection(path[i][0] - this.snake.headX, path[i][1] - this.snake.headY);
            this.snake.updatePosition();
        }
    }
}

class DFS extends Searcher {
    // expand the path via DFS by choosing the lowest cost
    search() {
        this.snake.updatePosition();
        this.snake.loseCondition();
        // find possible moves
        const moves = this.findLegalMoves(this.snake.headX, this.snake.headY);
        const distance = this.computeDistance(moves, this.snake.food.postition);
        // find min distance
        const minDist = Math.min(...distance);
        let minIndex = distance.indexOf(minDist);
        // check if the move will move away from the food when it's level with the food
        if (moves[minIndex][0] === this.snake.food.postition[0] || moves[minIndex][1] === this.snake.food.postition[1]) {
            console.log(moves[minIndex], this.snake.food.postition);
            const currDist = Math.abs(this.snake.food.postition[0] - this.snake.headX) + Math.abs(this.snake.food.postition[1] - this.snake.headY);
            if (minDist > currDist) {
                minIndex++;
            }
        }
        // choose move with closest distance
        this.snake.updateMovementDirection(moves[minIndex][0] - this.snake.headX, moves[minIndex][1] - this.snake.headY);
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
        if (this.headX === this.food.postition[0] && this.headY === this.food.postition[1]) {
            score++;
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
            this.reset();
        }
        if (this.headY >= canvasContext.canvas.height - 10|| this.headY <= 0) {
            this.reset();
        }
        // hit itself
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
    const scoreBoard = document.getElementById("score");
    scoreBoard.style.marginTop = canvas.height + 'px';
    // const snake = new Snake(canvasContext.canvas.width, canvasContext.canvas.height);
    const searcher = new Hamilton();
    const fps = 1;
    setInterval(function() {
        // snake.updatePosition();
        // snake.loseCondition();
        console.log("new search");
        
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