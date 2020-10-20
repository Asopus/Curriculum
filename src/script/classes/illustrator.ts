import { Apple } from "./apple.js";
import { SnakePart } from "./snakepart.js";

export class Illustrator {
    
    private _canvas: HTMLCanvasElement; 
    private _context: CanvasRenderingContext2D;
    
    constructor(canvas:HTMLCanvasElement) {
        this._canvas = canvas;
        this._context = this._canvas.getContext("2d");
    }
    
    public DrawApple(apple:Apple) 
    {
        this._context.fillStyle = "red";
        this._context.fillRect(apple.X ,apple.Y, apple.PartSize, apple.PartSize);
    }

    public DrawPart(part: SnakePart)
    {
        this._context.fillStyle = "lime";
        this._context.fillRect(part.X, part.Y, part.PartSize, part.PartSize);
        this._context.strokeRect(part.X, part.Y, part.PartSize, part.PartSize);
    }

    public DrawBoard() {
        this._context.fillStyle = "black";
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }
}