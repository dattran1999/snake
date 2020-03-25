import Snake from './snake.js'
import { canvasContext, canvas } from './utils.js'

class Searcher {
    constructor() {
        this.snake = new Snake(canvasContext.canvas.width, canvasContext.canvas.height);      
    }
    // find legal moves in the current position
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
            if (move[0] >= canvas.width-10 || move[0] <= 0
                || move[1] >= canvas.height-10 || move[1] <= 0) {
                illegal = true;
            }
            this.snake.body.forEach(element => {
                if (element[0] === move[0] && element[1] === move[1] && 
                    (element[0] !== this.snake.food.postition[0] || element[1] !== this.snake.food.postition[1])) {
                    illegal = true;
                }
            }, this);
            if (!illegal) return move;
        });
        return moves;
    }
    // compute distances to food for every possible moves
    computeDistance(moves, foodPosition) {
        return moves.map(move => 
            /* if moves have the same x or y coordinate as food, and snake is moving away from food, 
             * min dist is still moving away */
            (Math.abs(foodPosition[0] - move[0]) + Math.abs(foodPosition[1] - move[1]))
        );
    }

    getSnakeLength() {
        return this.snake.body.length;
    }

    reset() {
        this.snake.reset();
    }
}

class Hamilton extends Searcher {
    constructor() {
        super();
        this.path = [];
    }
    // search for way to reach the food by building a hamilton cycle
    searcher() {
        // find a path which has length snake body length + 1
        // path search is implemented by DFS
        let stack = [];
        this.seen = new Array(canvas.width/10).fill(false).map(() => new Array(canvas.height/10).fill(false));
        let seen = this.seen;
        // predecessor array
        let predecessor = new Array(canvas.width/10).fill(null).map(() => new Array(canvas.height/10).fill(null));
        // console.log(seen);
        console.log("start from: ", this.snake.headX, this.snake.headY);
        console.log("food at: ", this.snake.food.postition);
        
        // add some moves to the stack first
        let moves = this.findLegalMoves(this.snake.headX, this.snake.headY);
        let distance = this.computeDistance(moves, this.snake.food.postition);
        console.log(distance)
        for (let i = 0; i < distance.length; i++) {
            // find max index
            let maxIndex = distance.indexOf(Math.max(...distance));
            // push on stack (expand last)
            stack.push(moves[maxIndex]);
            // console.log("pushing moves: ", moves[maxIndex]);
            console.log(maxIndex)
            const currMoveX = moves[maxIndex][0]/10;
            const currMoveY = moves[maxIndex][1]/10;
            seen[currMoveX][currMoveY] = true;
            predecessor[currMoveX][currMoveY] = [this.snake.headX, this.snake.headY];
            distance[maxIndex] = -1;
        }
        // we reset seen array when we start again from lowest depth
        const numNodesLevel0 = stack.length;
        // let pathLength = 0;
        const snakeLength = this.snake.body.length;
        let path = [];
        // TODO: find the length of the path
        while (stack.length > 0) {
            // expand the stack
            const currMove = stack.pop();
            if (stack.length <= numNodesLevel0 - 2) {
                console.log("reseting");
                seen = new Array(canvas.width/10).fill(false).map(() => new Array(canvas.height/10).fill(false));
                predecessor = new Array(canvas.width/10).fill(null).map(() => new Array(canvas.height/10).fill(null));
                stack.forEach(element => {
                    predecessor[element[0]/10][element[1]/10] = [this.snake.headX, this.snake.headY];
                });
            }
            // potentially on the path
            const currX = Number(currMove[0]/10);
            const currY = Number(currMove[1]/10);
            // check if we've reach the food
            if (currMove[0] === this.snake.food.postition[0] && currMove[1] === this.snake.food.postition[1]) {
                // path is from currMove and trace all the way back to start node
                path = [];
                let currMovePointer = currMove;
                let prevPointer = null;
                while (Number(currMovePointer[0]) !== this.snake.headX || Number(currMovePointer[1]) !== this.snake.headY) {
                    path.unshift(currMovePointer);
                    const currPointerX = Number(currMovePointer[0]/10);
                    const currPointerY = Number(currMovePointer[1]/10);
                    if (prevPointer !== null && predecessor[currPointerX][currPointerY][0] === prevPointer[0] && predecessor[currPointerX][currPointerY][1] === prevPointer[1]) {
                        // console.log("detected cycle...")
                        // console.log(currMovePointer, "->", predecessor[currPointerX][currPointerY]);
                        break;
                    }
                    // console.log(currMovePointer, "->", predecessor[currPointerX][currPointerY], "compare with", this.snake.headX, this.snake.headY);
                    prevPointer = currMovePointer;
                    currMovePointer = predecessor[currPointerX][currPointerY];
                }
                // console.log("exit loop with: ", currMovePointer);
                let toPrint = "";
                path.forEach(element => {
                    toPrint = `${toPrint} ${element} ->`;
                });
                console.log(toPrint);
                console.log(`reached food, length: ${path.length}`);
                if (path.length > snakeLength) {
                    // console.log(`road to food: ${path.length}, was less than snake length ${snakeLength}`);
                    break;
                } else {
                    seen[currX][currY] = false;
                    continue;
                }
            }
            let moves = this.findLegalMoves(currMove[0], currMove[1]);
            if (moves === null) {
                continue;
            }
            let distance = this.computeDistance(moves, this.snake.food.postition);

            for (let i = 0; i < distance.length; i++) {
                // find max index
                let maxIndex = distance.indexOf(Math.max(...distance));
                // console.log(`expanding [${currMove}]`)
                // if current move is not seen                
                if (!seen[Number(moves[maxIndex][0]/10)][Number(moves[maxIndex][1]/10)]) {
                    // push on stack
                    stack.push(moves[maxIndex]);
                    // to store in array, divide the coordinates by 10
                    const moveX = Number(moves[maxIndex][0]/10);
                    const moveY = Number(moves[maxIndex][1]/10); 
                    // console.log("pushing moves: ", moves[maxIndex], "seen? : ", seen[Number(moves[maxIndex][0]/10)][Number(moves[maxIndex][1]/10)]);
                    seen[moveX][moveY] = true;
                    predecessor[moveX][moveY] = currMove;
                    // console.log(`setting predecessor of ${moves[maxIndex]} to be ${currMove}`);
                }
                distance[maxIndex] = -1;
            }
        }
        stack = null;
        delete this.seen;
        this.path = path;
    }
    search() {
        if (this.path.length === 0) {
            this.searcher();
        }
        const move = this.path.shift();
        // couldnt find any posible move 
        if (move === null || move === undefined) {
            this.snake.reset();
        }
        this.snake.updateMovementDirection(move[0] - this.snake.headX, move[1] - this.snake.headY);
        this.snake.updatePosition();
        if (move[0] !== this.snake.headX || move[1] !== this.snake.headY) {
            console.log("moving to: ", move, "snake head: ", [this.snake.headX, this.snake.headY]);
        }
        this.snake.loseCondition();
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
        if (moves.length === 0) {
            this.snake.reset;
            return;
        }        
        // check if the move will move away from the food when it's level with the food
        if (moves[minIndex][0] === this.snake.food.postition[0] || moves[minIndex][1] === this.snake.food.postition[1]) {
            // console.log(moves[minIndex], this.snake.food.postition);
            const currDist = Math.abs(this.snake.food.postition[0] - this.snake.headX) + Math.abs(this.snake.food.postition[1] - this.snake.headY);
            if (minDist > currDist) {
                minIndex++;
            }
        }
        if (minIndex > moves.length) {
            minIndex = 0;
        }
        // choose move with closest distance
        this.snake.updateMovementDirection(moves[minIndex][0] - this.snake.headX, moves[minIndex][1] - this.snake.headY);
    }
}
export {
    Hamilton,
    DFS
}