import { Game } from "./game.base.js";
import { GameConfiguration } from "./gameconfiguration.js";
import { Direction } from "../model/direction.js";

export class MobileGame extends Game {

    private _context:Game;
    
    constructor(screen:HTMLCanvasElement)
    {
        super(<GameConfiguration>({
            ScreenId: "mobile-screen",
            ScreenHeight: screen.height,
            ScreenWidth: screen.width,
            PartSize: 10,
            StartLength: 3,
            StartX: 80,
            StartY: 80,
            TicksPerSecond: 10,
            StartInstruction: "Touch the control pad to start collecting my competences ...",
            ContinueInstruction: "Touch the control pad to continue",
            PauseInstruction: "Touch the red button to pause"
        }));

        this._context = this;
    }
    
    protected Configure() {
        var web = this._dom.GetElementsByClassName("game-container")[0];
        var mobile = this._dom.GetElementsByClassName("mobile-game-container")[0];
        this._dom.RemoveClasses(mobile, "invisibile");
        web.remove();
        this.BindControls();
        let buttons = document.getElementsByClassName("touch-button") as HTMLCollectionOf<HTMLElement>
        for(let i=0;i<buttons.length;++i)
        {
            let button = buttons[i];
            button.addEventListener("touchstart", this.StartGame);
        }
    }

    private BindControls()
     {
        let buttons = this._dom.GetElementsByClassName<HTMLElement>("touch-button");
        for(let i=0;i<buttons.length;++i)
        {
            let button = buttons[i];
            let self = this;
            button.addEventListener("touchstart", function(e){ self._context.ChangeDirection(e, parseInt(button.getAttribute("data-key-code"))) });
        }
     }

    private StartGame = (touch:TouchEvent) =>
    { 
        var sender = touch.target as HTMLElement;
        let direction = parseInt(sender.getAttribute("data-key-code")) as Direction;
        if (direction in Direction && direction != Direction.Unknown)
        {
            this._context.Start();
            this._context.ChangeDirection(touch, direction);

            let buttons = document.getElementsByClassName("touch-button") as HTMLCollectionOf<HTMLElement>
            for(let i=0;i<buttons.length;++i)
            {
                let button = buttons[i];
                button.removeEventListener("touchstart", this.StartGame);
            }
        }
    }
    
}