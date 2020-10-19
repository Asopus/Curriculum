import {Game} from './classes/game.js';

let _game: Game;


window.onload = async (event) =>
{
    _game = new Game();
    window.addEventListener("keydown", StartGame)
    await _game.Init();
} 

function StartGame(key: any) { 
    if([37, 38, 39, 40].indexOf(key.keyCode) > -1) 
    {
        window.removeEventListener("keydown", StartGame)
        _game.Start();
    }
}