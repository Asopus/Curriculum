import {Apple} from './apple.js';
import {Snake} from './snake.js';
import {SnakePart} from './snakepart.js';
import {Competence} from './competence.js';
import { Direction } from './direction.js';
import { Dom } from './dom.js';
import { Api } from './api.js';

export class Game {
    private _apple: Apple = new Apple(440, 320, 10);
    private _snake: Snake = new Snake(3, 230, 170, 10);
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _hasDrawn:boolean = true;
    private _started: boolean = false;
    private _api:Api = new Api();
    private _dom:Dom;
    
    constructor(canvas: HTMLCanvasElement)
    {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");
    }

    public async Init()
    {
        this.DrawBoard();
        this.DrawSnake();
        this._api = new Api();
        this._dom = new Dom(await this._api.ReadCompetences());
    }

    public Start()
    {
        this._dom.Init();
        this._started = true;
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
            this._hasDrawn = true;
        }
    }

    public SetDirection(key: any) {

        if (this._started)
        {
            if([32, 37, 38, 39, 40].indexOf(key.keyCode) > -1) 
            {
                this._dom.SetInstruction("Press spacebar to pause");
                key.preventDefault();
            }   
    
            if (this._hasDrawn)
            {
                if (key.keyCode == 37 && this._snake.Direction != Direction.Left && this._snake.Direction != Direction.Right)
                {
                    this._hasDrawn = false;
                    this._snake.GoLeft();
                } else if (key.keyCode == 38 && this._snake.Direction != Direction.Up && this._snake.Direction != Direction.Down)
                {
                    this._hasDrawn = false;
                    this._snake.GoUp();
                } else if (key.keyCode == 39 && this._snake.Direction != Direction.Right && this._snake.Direction != Direction.Left)
                {
                    this._hasDrawn = false;
                    this._snake.GoRight();
                } else if (key.keyCode == 40 && this._snake.Direction != Direction.Down && this._snake.Direction != Direction.Up)
                {
                    this._hasDrawn = false;
                    this._snake.GoDown();
                }
            }
    
            if (key.keyCode == 32) // space
            {
                this._snake.Stop();
                this._dom.SetInstruction("Press any arrow key to continue");
            }
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