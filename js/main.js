import { DFS, Hamilton } from './searcher.js'
import { drawCanvas, canvasContext } from './utils.js'
import Game from './game.js'

window.onload = function() {
    let game = new Game(new DFS());
    // user chooses another search style
    const hamiltonButton = document.getElementById('hamilton-button');
    const dfsButton = document.getElementById('dfs-button');
    hamiltonButton.addEventListener('click', () => {
        game.endGame();
        game = new Game(new Hamilton());
    });
    dfsButton.addEventListener('click', () => {
        game.endGame();
        game = new Game(new DFS());
    });
}
