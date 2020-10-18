import { Apple } from './model/apple.js';
import { Snake } from './model/snake.js';
import { Illustrator } from './model/illustrator.js';
import { Competence } from './model/competence.js';
import { Technology } from './model/technology.js';
let _snake = new Snake(3, 230, 170, 10);
let _apple = new Apple(440, 320, 10);
let canvas = document.getElementById("screen");
let _illustrator = new Illustrator(canvas, _snake, _apple);
let _instructionElement = document.getElementById("instruction");
let _gameStarted = false;
let _hasDrawn = true;
window.onload = async (event) => {
    canvas.height = 350;
    canvas.width = 460;
    window.addEventListener("keydown", startGame);
    window.addEventListener("keydown", setDirection);
    initializeModalFocus();
    await readCompetences();
    document.getElementById("toCollect").innerText = "\xA0/ " + _illustrator.Competences.length;
    _illustrator.DrawBoard();
    _illustrator.DrawSnake();
};
function startGame(key) {
    if ([37, 38, 39, 40].indexOf(key.keyCode) > -1) {
        setInterval(tick, 1000 / 15);
        window.removeEventListener("keydown", startGame);
        _instructionElement.classList.remove("blink");
        _instructionElement.innerText = "Press spacebar to pause";
        let basket = document.getElementById("apple-basket");
        basket.classList.remove("invisible");
        basket.classList.add("animate__animated");
        basket.classList.add("animate__bounceInLeft");
        _gameStarted = true;
    }
}
function setDirection(key) {
    if (_hasDrawn) {
        if ([32, 37, 38, 39, 40].indexOf(key.keyCode) > -1) {
            _instructionElement.innerText = "Press spacebar to pause";
            key.preventDefault();
        }
        if (_hasDrawn) {
            if (key.keyCode == 37 && _snake.DirectionX == 0) {
                _hasDrawn = false;
                _snake.DirectionX = -1;
                _snake.DirectionY = 0;
            }
            else if (key.keyCode == 38 && _snake.DirectionY == 0) {
                _hasDrawn = false;
                _snake.DirectionX = 0;
                _snake.DirectionY = -1;
            }
            else if (key.keyCode == 39 && _snake.DirectionX == 0) {
                _hasDrawn = false;
                _snake.DirectionX = 1;
                _snake.DirectionY = 0;
            }
            else if (key.keyCode == 40 && _snake.DirectionY == 0) {
                _hasDrawn = false;
                _snake.DirectionX = 0;
                _snake.DirectionY = 1;
            }
        }
        if (key.keyCode == 32) {
            _snake.DirectionX = 0;
            _snake.DirectionY = 0;
            _instructionElement.innerText = "Press any arrow key to continue";
        }
    }
}
function tick() {
    if (_snake.DirectionX != 0 || _snake.DirectionY != 0) {
        _illustrator.DrawBoard();
        _snake.Move();
        _illustrator.DrawSnake();
        _illustrator.DrawApple();
        if (_snake.CollidesWith(_apple)) {
            _snake.AddPartToTail();
            _apple.Move();
            _illustrator.DrawCompetence();
        }
        _hasDrawn = true;
    }
}
function initializeModalFocus() {
    $('#competenceModal').keydown(function (e) {
        if (e.keyCode === 37) {
            $(".carousel-control-prev-icon").click();
            return false;
        }
        if (e.keyCode === 39) {
            $(".carousel-control-next-icon").click();
            return false;
        }
    });
}
function readCompetences() {
    let _competences = new Array();
    return $.ajax({
        url: "../../assets/competences/competences.json",
        type: "GET",
        success: function (response) {
            let result = response;
            for (let i = 0; i < result.length; ++i) {
                let currentCompetence = result[i];
                let technologies = new Array();
                for (let j = 0; j < currentCompetence.technologies.length; ++j) {
                    let currentTechnology = currentCompetence.technologies[j];
                    technologies.push(new Technology(currentTechnology.title, currentTechnology.rating));
                }
                let competence = new Competence(currentCompetence.title, currentCompetence.imgPath, currentCompetence.technologies);
            }
            _illustrator.Competences = _competences;
            console.log(_illustrator);
        },
        error: function (xhr, status) {
            console.log(xhr);
            console.log(status);
        }
    });
}
