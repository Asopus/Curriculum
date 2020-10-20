import { Apple } from "./apple.js";
import { SnakePart } from "./snakepart.js";
import { Snake } from "./snake.js";
import { Direction } from "./direction.js";

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
        else if (object instanceof Snake)
        {
            for(let i=0;i < object.BodyParts.length;++i)
            {
                let part = object.BodyParts[i];
                this.CheckBorderCollision(object, part);
                this.CheckBodyCollision(object,part);
                this.DrawPart(part);
            } 
        }
        else if (object instanceof HTMLCanvasElement)
        {
            this._context.fillStyle = "black";
            this._context.fillRect(0, 0, object.width, object.height);
        }
    }
    
    private CheckBodyCollision(snake:Snake, part: SnakePart)
    {
        if (snake.HeadCollidesWith(part)) 
        { 
            snake.ResetSnake();
        }
    }

    private CheckBorderCollision(snake:Snake, part: SnakePart)
    {
        if (snake.Direction == Direction.Right && part.X == this._context.canvas.width)
        {
            part.X = 0;
        }
        else if (snake.Direction == Direction.Left && part.X == 0 - part.PartSize)
        {
            part.X = this._context.canvas.width - part.PartSize;
        }
        else if (snake.Direction == Direction.Down && part.Y == this._context.canvas.height)
        {
            part.Y = 0;
        }
        else if (snake.Direction == Direction.Up && part.Y == 0 - part.PartSize)
        {
            part.Y = this._context.canvas.height - part.PartSize;
        }   
    }
    
    private DrawPart(part: SnakePart)
    {
        this._context.fillStyle = "lime";
        this._context.fillRect(part.X, part.Y, part.PartSize, part.PartSize);
        this._context.strokeRect(part.X, part.Y, part.PartSize, part.PartSize);
    }
}