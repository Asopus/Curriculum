import {Apple} from './apple.js';
import {Snake} from './snake.js';
import {SnakePart} from './snakepart.js';
import { Direction } from './direction.js';
import { Dom } from './dom.js';
import { Illustrator } from './illustrator.js';
import { Dir } from 'fs';

export class Game {
    private _apple: Apple = new Apple(440, 320, 10);
    private _snake: Snake = new Snake(3, 230, 170, 10);
    private _hasDrawn:boolean = true;
    private _started: boolean = false;
    private _dom:Dom = new Dom();
    private _screen:HTMLCanvasElement = this._dom.GetElementById<HTMLCanvasElement>("screen");
    private _illustrator:Illustrator = new Illustrator(this._screen.getContext("2d"));

    public async Init()
    {
        this._illustrator.Draw(this._screen);
        this._illustrator.Draw(this._snake);
        this._apple.Move(this._snake);
        await this._dom.Init();
        let self = this;
        window.addEventListener("keydown", function(key){ self.SetDirection(key) });
    }

    public Start()
    {
        this._dom.Init();
        this._started = true;
        let self = this;
        setInterval(function(){ self.Tick(); }, 1000/15);
    }

    public Tick()
    {
        if (this._snake.Direction != Direction.Unknown)
        {
            this._illustrator.Draw(this._screen);
            this._snake.Move();
            this._illustrator.Draw(this._snake);
            if (this._snake.HeadCollidesWith(this._apple)) 
            {
                this._snake.AddPartToTail();
                this._apple.Move(this._snake);
                this._dom.AddCompetence();
            }
            this._illustrator.Draw(this._apple);
            this._hasDrawn = true;
        }
    }

    public SetDirection(key: any) {

        if (this._started)
        {
            if (this._hasDrawn)
            {
                if([37, 38, 39, 40].indexOf(key.keyCode) > -1) 
                {
                    this._dom.SetInstruction("Press spacebar to pause");
                    this._hasDrawn = false;
                    key.preventDefault();
                    this._snake.ChangeDirection(key.keyCode as Direction);
                } 
                else if (key.keyCode == 32)
                {
                    this._dom.SetInstruction("Press any arrow key to continue");
                    key.preventDefault();
                    this._snake.Stop();
                }
            }
        }
     }
}