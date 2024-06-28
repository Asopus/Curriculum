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
    private _screen:HTMLCanvasElement;
    protected _dom:Dom;
    private _illustrator:Illustrator;
    private _configuration: GameConfiguration;
    private _hasDrawnLastDirection:boolean = true;
    private _started: boolean = false;

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
        this._illustrator = new Illustrator(this._screen.getContext("2d"));
        this._illustrator.Draw(this._screen);
        this._illustrator.Draw(this._snake);
        this._apple.Move(this._snake);
        this._dom.AddCompetenceDetails();
        this.Configure();
    }

    protected abstract Configure();

    public Start()
    {
        this._started = true;
        let self = this;
        this._dom.ConfigureModalFocus();
        setInterval(function(){ self.Tick(); }, 1000/this._configuration.TicksPerSecond);
    }

    public ChangeDirection(event:UIEvent, keyCode:number)
    {
        let direction = keyCode as Direction;
        if (this._started && this._hasDrawnLastDirection && direction in Direction)
        {
            event.preventDefault();
            this._snake.ChangeDirection(direction);
            this._hasDrawnLastDirection = direction == Direction.Unknown;
        }
    }

    private Tick()
    {
        if (this._snake.GetCurrentDirection() != Direction.Unknown)
        {
            this._illustrator.Draw(this._screen);
            this._snake.Move();
            this._snake.HandleCollision(this._screen);
            this._illustrator.Draw(this._snake);
            if (this._snake.HeadCollidesWith(this._apple)) 
            {
                this._snake.AddPartToTail();
                this._apple.Move(this._snake);
                let allCompetencesAdded = this._dom.AddCompetenceButton();
                if (allCompetencesAdded)
                {
                    this._dom.AddAboutButton();
                    this._dom.ShowCompletedModal();
                }
            }
            this._illustrator.Draw(this._apple);
            this._hasDrawnLastDirection = true;
        }
    }
}