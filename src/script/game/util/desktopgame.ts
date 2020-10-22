import { Game } from "./game.js";
import { GameConfiguration } from "./gameconfiguration.js";
import { Direction } from "../model/direction.js";

export class DesktopGame extends Game {
    constructor()
    {
        super(<GameConfiguration>({
            ScreenId: "screen",
            ScreenHeight: 350,
            ScreenWidth: 460,
            PartSize: 10,
            StartLength: 3,
            StartX: 230,
            StartY: 170,
            TicksPerSecond: 15,
            StartInstruction: "Press any arrow key to start collecting my competences ...",
            ContinueInstruction: "Press any arrow key to continue",
            PauseInstruction: "Press spacebar to pause"
        }));
    }

    protected Configure(context:Game) {
        var mobile = this._dom.GetElementsByClassName("mobile-game-container")[0];
        var web = this._dom.GetElementsByClassName("game-container")[0];
        this._dom.RemoveClasses(web, "invisibile");
        mobile.remove();
        window.addEventListener("keydown", function(e) { context.ChangeDirection(e, e.keyCode) });
        window.addEventListener("keydown", this.BindStart);
        context.Start();
    }

    private BindStart(key: any) { 
        let direction = key.keyCode as Direction;
        if (direction in Direction && direction != Direction.Unknown)
        {
            window.removeEventListener("keydown", this.BindStart)
        }
    }
}