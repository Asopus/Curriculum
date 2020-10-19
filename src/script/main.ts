import {Apple} from './classes/apple.js';
import {Snake} from './classes/snake.js';
import {Game} from './classes/game.js';
import {Competence} from './classes/competence.js';
import {Technology} from './classes/technology.js';
import { Direction } from './classes/direction.js';

let canvas = document.getElementById("screen") as HTMLCanvasElement; 
let _game: Game;


window.onload = async (event) =>
{
    canvas.height = 350;
    canvas.width = 460;
    _game = new Game(canvas);
    window.addEventListener("keydown", StartGame)
    window.addEventListener("keydown", SetDirectionClosure)    
    await _game.Init();
} 

function StartGame(key: any) { 
    if([37, 38, 39, 40].indexOf(key.keyCode) > -1) 
    {
        setInterval(TickClosure, 1000/15);
        window.removeEventListener("keydown", StartGame)
        _game.Start();
    }
}

function TickClosure() { _game.Tick(); }

function SetDirectionClosure(key:any) { _game.SetDirection(key); }

