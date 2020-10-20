import {Game} from './util/game.js';
import { Direction } from './model/direction.js';

let _game: Game;

window.onload = async (event) =>
{
    _game = new Game();
    window.addEventListener("keydown", StartGame)
    await _game.Init();
} 

function StartGame(key: any) { 
    let direction = key.keyCode as Direction;
    if (direction in Direction && direction != Direction.Unknown)
    {
        window.removeEventListener("keydown", StartGame)
        _game.Start();
    }
}