define("main", ["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let _snake = new Snake(3, 10, 230, 170);
    let _apple = new Apple(440, 320, 10);
    let canvas = document.getElementById("screen");
    let _illustrator = new Illustrator(canvas, _snake, _apple, readCompetences());
    let _instructionElement = document.getElementById("instruction");
    let _gameStarted = false;
    let _hasDrawn = false;
    window.onload = (event) => {
        alert('hi');
        canvas.height = 350;
        canvas.width = 460;
        window.addEventListener("keydown", startGame);
        window.addEventListener("keydown", setDirection);
        initializeModalFocus();
        document.getElementById("toCollect").innerText = "\xA0/ " + globalThis._illustrator.AllCompetences.length;
        globalThis._illustrator.DrawBoard();
        globalThis._illustrator.DrawSnake();
    };
    function startGame(key) {
        if ([37, 38, 39, 40].indexOf(key.keyCode) > -1) {
            setInterval(tick, 1000 / 15);
            window.removeEventListener("keydown", startGame);
            globalThis._instructionElement.classList.remove("blink");
            globalThis._instructionElement.innerText = "Press spacebar to pause";
            let basket = document.getElementById("apple-basket");
            basket.classList.remove("invisible");
            basket.classList.add("animate__animated");
            basket.classList.add("animate__bounceInLeft");
            globalThis._gameStarted = true;
        }
    }
    function setDirection(key) {
        if (this._gameStarted) {
            if ([32, 37, 38, 39, 40].indexOf(key.keyCode) > -1) {
                this._instructionElement.innerText = "Press spacebar to pause";
                key.preventDefault();
            }
            if (this._hasDrawn) {
                if (key.keyCode == 37 && this._snake.DirectionX == 0) {
                    this._hasDrawn = false;
                    this._snake.DirectionX = -1;
                    this._snake.DirectionY = 0;
                }
                else if (key.keyCode == 38 && this._snake.DirectionY == 0) {
                    this._hasDrawn = false;
                    this._snake.DirectionX = 0;
                    this._snake.DirectionY = -1;
                }
                else if (key.keyCode == 39 && this._snake.DirectionX == 0) {
                    this._hasDrawn = false;
                    this._snake.DirectionX = 1;
                    this._snake.DirectionY = 0;
                }
                else if (key.keyCode == 40 && this._snake.DirectionY == 0) {
                    this._hasDrawn = false;
                    this._snake.DirectionX = 0;
                    this._snake.DirectionY = 1;
                }
            }
            if (key.keyCode == 32) {
                this._snake.DirectionX = 0;
                this._snake.DirectionY = 0;
                this._instructionElement.innerText = "Press any arrow key to continue";
            }
        }
    }
    function tick() {
        if (this._snake.DirectionX != 0 || this._snake.DirectionY != 0) {
            _illustrator.DrawBoard();
            this._snake.Move();
            this._illustrator.DrawSnake();
            this._illustrator.DrawApple();
            if (this._snake.CollidesWith(this._apple)) {
                this._snake.AddPartToTail();
                this._apple.Move();
                this._illustrator.DrawCompetence();
            }
            this._hasDrawn = true;
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
        $.ajax({
            url: "../../assets/competences/competences.json",
            type: "GET",
            success: function (response) {
                let result = response;
                for (let i = 0; i < result.length; ++i) {
                    let currentCompetence = result[i];
                    let technologies = new Array();
                    for (let j = 0; j < result.technologies.length; ++j) {
                        let currentTechnology = result.technologies[j];
                        technologies.push(new Technology(currentTechnology.title, currentTechnology.rating));
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
});
class Apple {
    constructor(boundaryX, boundaryY, partSize) {
        this._boundaryX = boundaryX;
        this._boundaryY = boundaryY;
        this.PartSize = partSize;
        this.Move();
    }
    Move() {
        this.X = Math.floor(Math.random() * (this._boundaryX / this.PartSize) + 1) * this.PartSize;
        this.Y = Math.floor(Math.random() * (this._boundaryY / this.PartSize) + 1) * this.PartSize;
    }
}
class Competence {
    constructor(title, imgPath, technologies) {
        this.Title = title;
        this.ImgPath = imgPath;
        this.Technologies = technologies;
    }
}
class Technology {
    constructor(title, rating) {
        this.Title = title;
        this.Rating = rating;
    }
}
class Illustrator {
    constructor(canvas, snake, apple, competences) {
        this._numbers = ["one", "two", "three", "four", "five"];
        this._skillLevels = ["Novice", "Elementary", "Intermediate", "Advanced", "Expert"];
        this._canvas = canvas;
        this._context = canvas.getContext("2d");
        this._competences = competences;
        this._snake = snake;
        this._apple = apple;
    }
    DrawSnake() {
        for (let i = 0; i < this._snake.BodyParts.length; ++i) {
            let part = this._snake.BodyParts[i];
            this.drawPart(part);
            this.checkBorderCollision(part);
            this.checkBodyCollision(part);
        }
    }
    DrawApple() {
        this._context.fillStyle = "red";
        this._context.fillRect(this._apple.X, this._apple.Y, this._apple.PartSize, this._apple.PartSize);
    }
    checkBodyCollision(part) {
        let head = this._snake[this._snake.BodyParts.length - 1];
        if (part != head && head.X == part.X && head.Y == part.Y) {
            this._snake.BodyParts.splice(0, this._snake.BodyParts.length - this._snake.StartLength);
        }
    }
    checkBorderCollision(part) {
        if (this._snake.DirectionY == 0) {
            if (part.X == this._canvas.width) {
                part.X = 0;
            }
            else if (part.X == 0 - part.PartSize) {
                part.Y = this._canvas.width - part.PartSize;
            }
        }
        else if (this._snake.DirectionX == 0) {
            if (part.Y == this._canvas.height) {
                part.Y = 0;
            }
            else if (part.Y == 0 - part.PartSize) {
                part.Y = this._canvas.height - part.PartSize;
            }
        }
    }
    drawPart(part) {
        this._context.fillStyle = "lime";
        this._context.fillRect(part.X, part.Y, part.PartSize, part.PartSize);
        this._context.strokeRect(part.X, part.Y, part.PartSize, part.PartSize);
    }
    DrawBoard() {
        this._context.fillStyle = "black";
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }
    DrawCompetence() {
        let score = document.getElementById("score");
        let oldScore = parseInt(score.innerText);
        if (oldScore != this._competences.length) {
            let currentCompetence = this._competences[oldScore];
            score.innerText = (oldScore + 1).toString();
            let competences = document.getElementById("competences");
            let competence = document.createElement("div");
            competence.classList.add("competence");
            competence.classList.add("animate__animated");
            competence.classList.add("animate__swing");
            competence.classList.add("animate__slow");
            competence.setAttribute('data-target', "#competenceCarousel");
            competence.setAttribute('data-slide-to', oldScore.toString());
            let competenceTitle = document.createElement("span");
            competenceTitle.innerHTML = currentCompetence.Title;
            competence.appendChild(competenceTitle);
            competences.appendChild(competence);
            let carousel = document.getElementById("innerCarousel");
            let carouselItem = document.createElement("div");
            carouselItem.classList.add("carousel-item");
            if (oldScore == 0) {
                carouselItem.classList.add("active");
            }
            let technologyHeader = document.createElement("div");
            technologyHeader.classList.add("row");
            technologyHeader.classList.add("competence-technologies");
            technologyHeader.classList.add("header");
            let headerName = document.createElement("div");
            headerName.classList.add("col");
            headerName.classList.add("competence-header-name");
            headerName.innerText = currentCompetence.Title;
            technologyHeader.appendChild(headerName);
            for (let i = 0; i < this._numbers.length; ++i) {
                let titleElement = document.createElement("div");
                titleElement.classList.add("col");
                titleElement.classList.add(this._numbers[i]);
                titleElement.innerText = this._skillLevels[i];
                technologyHeader.appendChild(titleElement);
            }
            carouselItem.appendChild(technologyHeader);
            for (let i = 0; i < currentCompetence.Technologies.length; ++i) {
                let currentTechnology = currentCompetence.Technologies[i];
                let technologies = document.createElement("div");
                technologies.classList.add("row");
                technologies.classList.add("competence-technologies");
                let nameElement = document.createElement("div");
                nameElement.classList.add("name");
                nameElement.classList.add("col");
                let namespan = document.createElement("span");
                namespan.innerText = currentTechnology.Title;
                nameElement.appendChild(namespan);
                technologies.appendChild(nameElement);
                for (let j = 0; j < currentTechnology.Rating; ++j) {
                    let imgContainer = document.createElement("div");
                    imgContainer.classList.add(this._numbers[j]);
                    imgContainer.classList.add("col");
                    let imgElement = document.createElement("img");
                    imgElement.width = 25;
                    imgElement.height = 30;
                    imgElement.src = "../../assets/img/apple.png";
                    imgContainer.appendChild(imgElement);
                    technologies.appendChild(imgContainer);
                }
                carouselItem.appendChild(technologies);
            }
            carousel.appendChild(carouselItem);
        }
    }
}
class Snake {
    constructor(startLength, startPositionX, startPositionY, partSize) {
        this.DirectionX = 0;
        this.DirectionY = 0;
        this.StartLength = startLength;
        this._startPositionX = startPositionX;
        this._startPositionY = startPositionY;
        this._partSize = partSize;
        this.Init();
    }
    Init() {
        for (let i = 0; i < this.StartLength; ++i) {
            this.BodyParts.push(new SnakePart(this._startPositionX + i * this._partSize, this._startPositionY, this._partSize));
        }
    }
    Move() {
        this.BodyParts.shift();
        let head = this.BodyParts[this.BodyParts.length - 1];
        this.BodyParts.push(new SnakePart(head.X + (head.PartSize * this.DirectionX), head.Y + (head.PartSize * this.DirectionY), head.PartSize));
    }
    CollidesWith(apple) {
        let head = this.BodyParts[this.BodyParts.length - 1];
        return head.X == apple.X && head.Y == apple.Y;
    }
    AddPartToTail() {
        let tail = this.BodyParts[0];
        this.BodyParts.unshift(new SnakePart(tail.X - tail.PartSize, tail.Y, tail.PartSize));
    }
}
class SnakePart {
    constructor(X, Y, partSize) {
        this.X = X;
        this.Y = Y;
        this.PartSize = partSize;
    }
}
//# sourceMappingURL=build.js.map