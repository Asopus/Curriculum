import {Apple} from '../model/apple.js';
import {Snake} from '../model/snake.js';
import { FileReader } from "./filereader.js";
import { Direction } from '../model/direction.js';
import { Dom } from './dom.js';
import { Illustrator } from './illustrator.js';
import { GameConfiguration, GameType } from './gameconfiguration.js';

export class Game {
    private _partSize = 10;
    private _ticksPerSecond = 15;
    private _apple: Apple;
    private _snake: Snake;
    private _isDrawing:boolean = false;
    private _started: boolean = false;
    private _dom:Dom;
    private _screen:HTMLCanvasElement;
    private _illustrator:Illustrator;
    private _configuration: GameConfiguration;

    constructor(configuration:GameConfiguration)
    {
        this._configuration = configuration;
        this._apple = new Apple(configuration.ScreenWidth - 20, configuration.ScreenHeight - 20, configuration.PartSize);
        this._snake = new Snake(configuration.StartLength, configuration.StartX, configuration.StartY, configuration.PartSize);
    }

    public async Init()
    {
        this._dom = new Dom(await new FileReader().ReadCompetences());
        this._screen  = this._dom.GetElementById<HTMLCanvasElement>(this._configuration.ScreenId);
        this._screen.height = this._configuration.ScreenHeight;
        this._screen.width = this._configuration.ScreenWidth;
        this._illustrator = new Illustrator(this._screen.getContext("2d"));
        this._illustrator.Draw(this._screen);
        this._illustrator.Draw(this._snake);
        this._apple.Move(this._snake);
        let self = this;
        window.addEventListener("keydown", function(key){ self.ChangeDirection(key) });
        if (this._configuration.Type == GameType.Mobile)
        {
            this.BindMobileKeys(self);
        }
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

    public ChangeDirection(keyCode:number);
    public ChangeDirection(keyCode:KeyboardEvent);
    public ChangeDirection(object: any)
    {
        if (this._started)
        {
            if (!this._isDrawing)
            {
                let direction = object instanceof KeyboardEvent ? object.keyCode as Direction : object as Direction;
                if (direction in Direction)
                    {
                        if (object instanceof KeyboardEvent)
                        {
                            object.preventDefault();
                        }

                        this._snake.ChangeDirection(direction);
                        this._dom.SetInstruction(direction == Direction.Unknown ? "Press any arrow key to continue" : "Press spacebar to pause");
                        this._isDrawing = direction != Direction.Unknown;
                    }
            }
        }
     }

     private BindMobileKeys(context:Game)
     {
        let buttons = this._dom.GetElementsByClassName<HTMLElement>("touch-button");
        for(let i=0;i<buttons.length;++i)
        {
            let button = buttons[i];
            button.addEventListener("touchstart", function(key){ context.ChangeDirection(parseInt(button.getAttribute("data-key-code"))) });
        }
     }
}