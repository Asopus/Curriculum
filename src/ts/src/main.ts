import $ = require("jquery");

let _snake: Snake = new Snake(3, 10, 230, 170);
let _apple: Apple = new Apple(440, 320, 10);
let canvas = document.getElementById("screen") as HTMLCanvasElement; 
let _illustrator: Illustrator = new Illustrator(canvas, _snake, _apple, readCompetences());
let _instructionElement: HTMLElement = document.getElementById("instruction");
let _gameStarted: boolean = false;
let _hasDrawn: boolean = false;

window.onload = (event) =>
{
    alert('hi');
    canvas.height = 350;
    canvas.width = 460;
    window.addEventListener("keydown", startGame)
    window.addEventListener("keydown", setDirection)
    initializeModalFocus();
    document.getElementById("toCollect").innerText = "\xA0/ " + globalThis._illustrator.AllCompetences.length;
    globalThis._illustrator.DrawBoard();
    globalThis._illustrator.DrawSnake();
} 

function startGame(key: any) { 
    if([37, 38, 39, 40].indexOf(key.keyCode) > -1) 
    {
        setInterval(tick, 1000/15);
        window.removeEventListener("keydown", startGame)
        globalThis._instructionElement.classList.remove("blink");
        globalThis._instructionElement.innerText = "Press spacebar to pause";
        let basket = document.getElementById("apple-basket");
        basket.classList.remove("invisible");
        basket.classList.add("animate__animated");
        basket.classList.add("animate__bounceInLeft");
        globalThis._gameStarted = true;
    }
}

function setDirection(key: any) {

    if (this._gameStarted)
    {
        if([32, 37, 38, 39, 40].indexOf(key.keyCode) > -1) 
        {
            this._instructionElement.innerText = "Press spacebar to pause";
            key.preventDefault();
        }   

        if (this._hasDrawn)
        {
            if (key.keyCode == 37 && this._snake.DirectionX == 0) // left
            {this._hasDrawn = false;
                this._snake.DirectionX = -1;
                this._snake.DirectionY = 0;
            } else if (key.keyCode == 38 && this._snake.DirectionY == 0) // up
            {
                this._hasDrawn = false;
                this._snake.DirectionX = 0;
                this._snake.DirectionY = -1;
            } else if (key.keyCode == 39 && this._snake.DirectionX == 0) // right
            {
                this._hasDrawn = false;
                this._snake.DirectionX = 1;
                this._snake.DirectionY = 0;
            } else if (key.keyCode == 40 && this._snake.DirectionY == 0) // down
            {
                this._hasDrawn = false;
                this._snake.DirectionX = 0;
                this._snake.DirectionY = 1;
            }
        }

        if (key.keyCode == 32) // space
        {
            this._snake.DirectionX = 0;
            this._snake.DirectionY = 0;
            this._instructionElement.innerText = "Press any arrow key to continue";
        }
    }
 }


function tick()
{
    if (this._snake.DirectionX != 0 || this._snake.DirectionY != 0)
    {
        _illustrator.DrawBoard();
        this._snake.Move();
        this._illustrator.DrawSnake();
        this._illustrator.DrawApple();
        if (this._snake.CollidesWith(this._apple)) 
        {
            this._snake.AddPartToTail();
            this._apple.Move();
            this._illustrator.DrawCompetence();
        }
        this._hasDrawn = true;
    }
}

function initializeModalFocus()
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

function readCompetences() : Array<Competence> 
{
    let _competences: Array<Competence> = new Array<Competence>();

    $.ajax({
        url: "../../assets/competences/competences.json",
        type: "GET",
        success: function (response) {
            let result = response;
            for(let i=0;i< result.length;++i)
            {
                let currentCompetence = result[i];
                let technologies: Array<Technology> = new Array<Technology>();
                for(let j=0;j< result.technologies.length;++j)
                {
                    let currentTechnology = result.technologies[j];
                    technologies.push(new Technology(currentTechnology.title, currentTechnology.rating))
                }
                let competence = new Competence(currentCompetence.title, currentCompetence.imgPath, currentCompetence.technologies);
            }
            
            return _competences;
        },
        error: function (xhr, status) {
            console.log(xhr);
            console.log(status);
        }
    });
    
    return null;
}