import { Game } from "./game.js";
import { GameConfiguration } from "./gameconfiguration.js";

export class MobileGame extends Game {
    constructor()
    {
        var screen = document.getElementById("mobile-screen") as HTMLCanvasElement;

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
    }
    
    protected Configure(context:Game) {
        var web = this._dom.GetElementsByClassName("game-container")[0];
        var mobile = this._dom.GetElementsByClassName("mobile-game-container")[0];
        this._dom.RemoveClasses(mobile, "invisibile");
        web.remove();
        this.BindControls(context);

        let buttons = document.getElementsByClassName("touch-button") as HTMLCollectionOf<HTMLElement>
        for(let i=0;i<buttons.length;++i)
        {
            let button = buttons[i];
            button.addEventListener("touchstart", this.BindStart);
        }

        context.Start();
    }

    private BindControls(context:Game)
     {
        let buttons = this._dom.GetElementsByClassName<HTMLElement>("touch-button");
        for(let i=0;i<buttons.length;++i)
        {
            let button = buttons[i];
            button.addEventListener("touchstart", function(e){ context.ChangeDirection(e, parseInt(button.getAttribute("data-key-code"))) });
        }
     }

    private BindStart()
    {
        let buttons = document.getElementsByClassName("touch-button") as HTMLCollectionOf<HTMLElement>
        for(let i=0;i<buttons.length;++i)
        {
            let button = buttons[i];
            button.removeEventListener("touchstart", this.BindStart);
        }
    }
}