import {Apple} from './classes/apple.js';
import {Snake} from './classes/snake.js';
import {Game} from './classes/game.js';
import {Competence} from './classes/competence.js';
import {Technology} from './classes/technology.js';
import { Direction } from './classes/direction.js';

let _snake: Snake = new Snake(3, 230, 170, 10);
let _apple: Apple = new Apple(440, 320, 10);
let canvas = document.getElementById("screen") as HTMLCanvasElement; 
let _game: Game = new Game(canvas, _snake, _apple);
let _instructionElement: HTMLElement = document.getElementById("instruction");


window.onload = async (event) =>
{
    canvas.height = 350;
    canvas.width = 460;
    window.addEventListener("keydown", StartGame)
    window.addEventListener("keydown", SetDirection)
    InitializeModalFocus();
    await ReadCompetences();
    document.getElementById("toCollect").innerText = "\xA0/ " + _game.Competences.length;
    _game.Init();
} 

function StartGame(key: any) { 
    if([37, 38, 39, 40].indexOf(key.keyCode) > -1) 
    {
        setInterval(_game.Tick, 1000/15);
        window.removeEventListener("keydown", StartGame)
        _instructionElement.classList.remove("blink");
        _instructionElement.innerText = "Press spacebar to pause";
        let basket = document.getElementById("apple-basket");
        basket.classList.remove("invisible");
        basket.classList.add("animate__animated");
        basket.classList.add("animate__bounceInLeft");
        _game.Started = true;
    }
}

function SetDirection(key: any) {

    if (_game.Started)
    {
        if([32, 37, 38, 39, 40].indexOf(key.keyCode) > -1) 
        {
            _instructionElement.innerText = "Press spacebar to pause";
            key.preventDefault();
        }   

        if (_game.HasDrawn)
        {
            if (key.keyCode == 37 && _snake.Direction != Direction.Left && _snake.Direction != Direction.Right)
            {
                _game.HasDrawn = false;
                _snake.GoLeft();
            } else if (key.keyCode == 38 && _snake.Direction != Direction.Up && _snake.Direction != Direction.Down)
            {
                _game.HasDrawn = false;
                _snake.GoUp();
            } else if (key.keyCode == 39 && _snake.Direction != Direction.Right && _snake.Direction != Direction.Left)
            {
                _game.HasDrawn = false;
                _snake.GoRight();
            } else if (key.keyCode == 40 && _snake.Direction != Direction.Down && _snake.Direction != Direction.Up)
            {
                _game.HasDrawn = false;
                _snake.GoDown();
            }
        }

        if (key.keyCode == 32) // space
        {
            _snake.Stop();
            _instructionElement.innerText = "Press any arrow key to continue";
        }
    }
 }

function InitializeModalFocus()
{
    $('#competenceModal').keydown(function(e) {
        if (e.keyCode === 37) {
           // Previous
           $(".carousel-control-prev-icon").click();
           return false;
        }
        if (e.keyCode === 39) {
           // Next
           $(".carousel-control-next-icon").click();
           return false;
        }
    });
}

function ReadCompetences()
{
    let _competences: Array<Competence> = new Array<Competence>();

    return $.ajax({
        url: "../../assets/competences/competences.json",
        type: "GET",
        success: function (response) {
            let result = response;
            for(let i=0;i< result.length;++i)
            {
                let currentCompetence = result[i];
                let technologies: Array<Technology> = new Array<Technology>();
                for(let j=0;j< currentCompetence.technologies.length;++j)
                {
                    let currentTechnology = currentCompetence.technologies[j];
                    technologies.push(new Technology(currentTechnology.title, currentTechnology.rating))
                }
                let competence = new Competence(currentCompetence.title, currentCompetence.imgPath, technologies);
                _competences.push(competence);
            }
            _game.Competences = _competences;
        },
        error: function (xhr, status) {
            console.log(xhr);
            console.log(status);
        }
    });
}