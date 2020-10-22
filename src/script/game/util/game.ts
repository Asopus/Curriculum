import {Apple} from '../model/apple.js';
import {Snake} from '../model/snake.js';
import { FileReader } from "./filereader.js";
import { Direction } from '../model/direction.js';
import { Dom } from './dom.js';
import { Illustrator } from './illustrator.js';
import { GameConfiguration } from './gameconfiguration.js';

export abstract class Game {
    private _apple: Apple;
    private _snake: Snake;
    private _isDrawing:boolean = false;
    private _started: boolean = false;
    protected _dom:Dom;
    private _screen:HTMLCanvasElement;
    private _illustrator:Illustrator;
    private _configuration: GameConfiguration;

    constructor(configuration:GameConfiguration)
    {
        this._configuration = configuration;
        this._apple = new Apple(configuration.ScreenWidth - this._configuration.PartSize * 2, configuration.ScreenHeight - this._configuration.PartSize * 2, configuration.PartSize);
        this._snake = new Snake(configuration.StartLength, configuration.StartX, configuration.StartY, configuration.PartSize);
    }

    public async Load()
    {
        this._dom = new Dom(await new FileReader().ReadCompetences());
        this._screen  = this._dom.GetElementById<HTMLCanvasElement>(this._configuration.ScreenId);
        this._screen.height = this._configuration.ScreenHeight;
        this._screen.width = this._configuration.ScreenWidth;
        this._illustrator = new Illustrator(this._screen.getContext("2d"));
        this._illustrator.Draw(this._screen);
        this._illustrator.Draw(this._snake);
        this._apple.Move(this._snake);
        this._dom.SetInstruction(this._configuration.StartInstruction)
        this.Configure(this);
    }

    protected abstract Configure(context:Game);

    public Start()
    {
        this._started = true;
        let self = this;
        this._dom.ShowBasket();
        this._dom.RemoveStartInstruction();
        this._dom.ConfigureModalFocus();
        setInterval(function(){ self.Tick(); }, 1000/this._configuration.TicksPerSecond);
    }

    public ChangeDirection(event:UIEvent, keyCode:number)
    {
        if (this._started)
        {
            if (!this._isDrawing)
            {
                let direction = keyCode as Direction;
                if (direction in Direction)
                {
                    event.preventDefault();
                    this._snake.ChangeDirection(direction);
                    this._dom.SetInstruction(direction == Direction.Unknown ? this._configuration.ContinueInstruction : this._configuration.PauseInstruction);
                    this._isDrawing = direction != Direction.Unknown;
                }
            }
        }
    }

    private Tick()
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
}