import {Apple} from './apple.js';
import {Snake} from './snake.js';
import {SnakePart} from './snakepart.js';
import {Competence} from './competence.js';
import { Direction } from './direction.js';
import { Dom } from './dom.js';
import { Api } from './api.js';

export class Game {
    private _apple: Apple;
    private _snake: Snake;
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    public HasDrawn:boolean = true;
    public Started: boolean = false;
    private _api:Api = new Api();
    private _dom:Dom;
    
    constructor(canvas: HTMLCanvasElement, snake: Snake, apple: Apple)
    {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");
        this._snake = snake;
        this._apple = apple;
    }

    public async Init()
    {
        this.DrawBoard();
        this.DrawSnake();
        this._api = new Api();
        this._dom = new Dom(await this._api.ReadCompetences());
    }

    public Tick()
    {
        if (this._snake.Direction != Direction.Unknown)
        {
            this.DrawBoard();
            this._snake.Move();
            this.DrawSnake();
            this.DrawApple();
            if (this._snake.HeadCollidesWith(this._apple)) 
            {
                this._snake.AddPartToTail();
                this._apple.Move(this._snake);
                this._dom.AddCompetence();
            }
            this.HasDrawn = true;
        }
    }

    private CheckBodyCollision(part: SnakePart)
    {
        if (this._snake.HeadCollidesWithPart(part)) 
        { 
            this._snake.ResetSnake();
        }
    }

    private CheckBorderCollision(part: SnakePart)
    {
        if (this._snake.Direction == Direction.Right && part.X == this._canvas.width)
        {
            part.X = 0;
        }
        else if (this._snake.Direction == Direction.Left && part.X == 0 - part.PartSize)
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

    private DrawSnake() 
    {
        for(let i=0;i < this._snake.BodyParts.length;++i)
        {
            let part = this._snake.BodyParts[i];
            this.DrawPart(part);
            this.CheckBorderCollision(part);
            this.CheckBodyCollision(part);
        } 
    }

    private DrawApple() 
    {
        this._context.fillStyle = "red";
        this._context.fillRect(this._apple.X ,this._apple.Y, this._apple.PartSize, this._apple.PartSize);
    }

    private DrawPart(part: SnakePart)
    {
        this._context.fillStyle = "lime";
        this._context.fillRect(part.X, part.Y, part.PartSize, part.PartSize);
        this._context.strokeRect(part.X, part.Y, part.PartSize, part.PartSize);
    }

    private DrawBoard() {
        this._context.fillStyle = "black";
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }
}