import { Game } from "./game.base.js";
import { GameConfiguration } from "./gameconfiguration.js";
import { Direction } from "../model/direction.js";

export class DesktopGame extends Game {

    private _context:Game;
    
    constructor(screen:HTMLCanvasElement)
    {
        super(<GameConfiguration>({
            ScreenId: "screen",
            ScreenHeight: screen.height,
            ScreenWidth: screen.width,
            PartSize: 15,
            StartLength: 3,
            StartX: 75,
            StartY: 75,
            TicksPerSecond: 15,
            StartInstruction: "Press any arrow key to start collecting my competences",
            ContinueInstruction: "Press any arrow key to continue",
            PauseInstruction: "Press spacebar to pause"
        }));

        this._context = this;
    }

    protected Configure() {
        var mobile = this._dom.GetElementsByClassName("mobile-game-container")[0];
        var web = this._dom.GetElementsByClassName("game-container")[0];
        this._dom.RemoveClasses(web, "invisibile");
        mobile.remove();
        let self = this;
        window.addEventListener("keydown", function(e) { self._context.ChangeDirection(e, e.keyCode) });
        window.addEventListener("keydown", this.StartGame);
    }

    private StartGame = (key: KeyboardEvent) =>
    {
        let direction = key.keyCode as Direction;
        if (direction in Direction && direction != Direction.Unknown)
        {
            this._context.Start();
            this._context.ChangeDirection(key, key.keyCode);
            window.removeEventListener("keydown", this.StartGame)
        }
    }
}