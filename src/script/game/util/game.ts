import {Apple} from '../model/apple.js';
import {Snake} from '../model/snake.js';
import { FileReader } from "./filereader.js";
import { Direction } from '../model/direction.js';
import { Dom } from './dom.js';
import { Illustrator } from './illustrator.js';

export class Game {
    private _partSize = 10;
    private _ticksPerSecond = 15;
    private _apple: Apple = new Apple(440, 320, this._partSize);
    private _snake: Snake = new Snake(3, 230, 170, this._partSize);
    private _isDrawing:boolean = false;
    private _started: boolean = false;
    private _dom:Dom;
    private _screen:HTMLCanvasElement;
    private _illustrator:Illustrator;

    public async Init()
    {
        this._dom = new Dom(await new FileReader().ReadCompetences());
        this._screen  = this._dom.GetElementById<HTMLCanvasElement>("screen");
        this._illustrator = new Illustrator(this._screen.getContext("2d"));
        this._illustrator.Draw(this._screen);
        this._illustrator.Draw(this._snake);
        this._apple.Move(this._snake);
        let self = this;
        window.addEventListener("keydown", function(key){ self.ChangeDirection(key) });
    }

    public Start()
    {
        this._started = true;
        let self = this;
        this._dom.RemoveStartInstruction();
        this._dom.ShowBasket();
        this._dom.ConfigureModalFocus();
        setInterval(function(){ self.Tick(); }, 1000/this._ticksPerSecond);
    }

    public Tick()
    {
        if (this._snake.GetCurrentDirection() != Direction.Unknown)
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
            this._isDrawing = false;
        }
    }

    public ChangeDirection(key: any)
    {
        if (this._started)
        {
            if (!this._isDrawing)
            {
                let direction = key.keyCode as Direction;
                if (direction in Direction)
                {
                    key.preventDefault();
                    this._snake.ChangeDirection(direction);
                    this._dom.SetInstruction(direction == Direction.Unknown ? "Press any arrow key to continue" : "Press spacebar to pause");
                    this._isDrawing = direction != Direction.Unknown;
                }
            }
        }
     }
}