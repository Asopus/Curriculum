import {Apple} from './apple.js';
import {Snake} from './snake.js';
import {SnakePart} from './snakepart.js';
import {Competence} from './competence.js';
import { Direction } from './direction.js';

export class Illustrator {
    private _apple: Apple;
    private _snake: Snake;
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _numbers = ["one","two","three","four","five"];
    private _skillLevels = ["Novice", "Elementary", "Intermediate", "Advanced", "Expert"];
    public Competences: Array<Competence>;
    
    constructor(canvas: HTMLCanvasElement, snake: Snake, apple: Apple)
    {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");
        this._snake = snake;
        this._apple = apple;
    }

    public DrawSnake() 
    {
        for(let i=0;i < this._snake.BodyParts.length;++i)
        {
            let part = this._snake.BodyParts[i];
            this.DrawPart(part);
            this.CheckBorderCollision(part);
            this.CheckBodyCollision(part);
        } 
    }

    public DrawApple() 
    {
        this._context.fillStyle = "red";
        this._context.fillRect(this._apple.X ,this._apple.Y, this._apple.PartSize, this._apple.PartSize);
    }

    private CheckBodyCollision(part: SnakePart)
    {
        let head: SnakePart = this._snake.BodyParts[this._snake.BodyParts.length - 1];
        
        if (part != head && head.X  == part.X && head.Y == part.Y) 
        { 
            this._snake.BodyParts.splice(0, this._snake.BodyParts.length - this._snake.StartLength);
        }
    }

    private CheckBorderCollision(part: SnakePart)
    {
        if (this._snake.Direction == Direction.Right && part.X == this._canvas.width)
        {
            part.X = 0;
        }
        else if (this._snake.Direction == Direction.Left &&part.X == 0 - part.PartSize)
        {
            part.X = this._canvas.width - part.PartSize;
        }
        else if (this._snake.Direction == Direction.Down && part.Y == this._canvas.height)
        {
            part.Y = 0;
        }
        else if (this._snake.Direction == Direction.Up && part.Y == 0 - part.PartSize)
        {
            part.Y = this._canvas.height - part.PartSize;
        }   
    }

    private DrawPart(part: SnakePart)
    {
        this._context.fillStyle = "lime";
        this._context.fillRect(part.X, part.Y, part.PartSize, part.PartSize);
        this._context.strokeRect(part.X, part.Y, part.PartSize, part.PartSize);
    }

    public DrawBoard() {
        this._context.fillStyle = "black";
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }

    public DrawCompetence()
    {
        let score = document.getElementById("score") as HTMLElement;
        let oldScore = parseInt(score.innerText);
        if(oldScore != this.Competences.length)
        {
            let currentCompetence = this.Competences[oldScore];
            score.innerText = (oldScore + 1).toString();
            let competences = document.getElementById("competences") as HTMLElement;
            let competence =  document.createElement("div");
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
            
            let carousel = document.getElementById("innerCarousel") as HTMLElement;

            let carouselItem = document.createElement("div");
            carouselItem.classList.add("carousel-item");

            if (oldScore == 0)
            {
                carouselItem.classList.add("active");
            }

            let technologyHeader = document.createElement("div");
            technologyHeader.classList.add("row");
            technologyHeader.classList.add("competence-technologies");
            technologyHeader.classList.add("header");
            let headerName = document.createElement("div");
            headerName.classList.add("col");
            headerName.classList.add("competence-header-name");
            headerName.innerText= currentCompetence.Title;

            technologyHeader.appendChild(headerName);

            for (let i=0;i<this._numbers.length;++i)
            {
                let titleElement = document.createElement("div");
                titleElement.classList.add("col");
                titleElement.classList.add(this._numbers[i]);
                titleElement.innerText= this._skillLevels[i];
                technologyHeader.appendChild(titleElement);
            }
            
            carouselItem.appendChild(technologyHeader);

            for (let i=0;i<currentCompetence.Technologies.length;++i)
            {
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

                for (let j=0;j<currentTechnology.Rating;++j)
                {
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

        if (oldScore == this.Competences.length - 1)
        {
            let competences = document.getElementById("competences") as HTMLElement;
            competences.children[0].classList.remove("animate__swing");
            competences.children[0].classList.add("animate__tada");
            competences.children[0].classList.add("animate__infinite");
            competences.children[0].addEventListener("click", this.RemoveAttentionSeeker)
        }
    }

    private RemoveAttentionSeeker() {
        let competences = document.getElementById("competences") as HTMLElement;
        competences.children[0].classList.remove("animate__tada");
        competences.children[0].classList.remove("animate__infinite");
        competences.children[0].removeEventListener("click", this.RemoveAttentionSeeker)
    }
}