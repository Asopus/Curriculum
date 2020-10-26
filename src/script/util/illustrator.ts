import { Apple } from "../model/apple.js";
import { SnakePart } from "../model/snakepart.js";
import { Snake } from "../model/snake.js";

export class Illustrator {
    
    private _context: CanvasRenderingContext2D;
    
    constructor(context:CanvasRenderingContext2D) {
        this._context = context;
    }

    public Draw(apple:Apple);
    public Draw(snake:Snake);
    public Draw(screen:HTMLCanvasElement);
    public Draw(object:any)
    {
        if (object instanceof Apple)
        {
            this._context.fillStyle = "red";
            this._context.fillRect(object.X ,object.Y, object.PartSize, object.PartSize);
        }
        else if (object instanceof HTMLCanvasElement)
        {
            this._context.fillStyle = "black";
            this._context.fillRect(0, 0, object.width, object.height);
        }
        else if (object instanceof Snake)
        {
            let bodyParts:Array<SnakePart> = object.GetBodyParts();
            for(let i=0;i < bodyParts.length;++i)
            {
                this.DrawPart(bodyParts[i]);
            } 
        }
    }

    private DrawPart(part: SnakePart)
    {
        this._context.fillStyle = "lime";
        this._context.fillRect(part.X, part.Y, part.PartSize, part.PartSize);
        this._context.strokeRect(part.X, part.Y, part.PartSize, part.PartSize);
    }
}