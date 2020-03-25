// global var
const canvas = document.getElementById("gameCanvas");
const canvasContext = canvas.getContext("2d");

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

export {
    canvasContext,
    canvas,
    drawCanvas,
}