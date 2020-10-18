import { Snake } from './snake';

export class Apple {
    public X: number;
    public Y: number;
    private _boundaryX: number;
    private _boundaryY: number;
    public PartSize: number;

    constructor(boundaryX: number, boundaryY: number, partSize: number)
    {
        this._boundaryX = boundaryX
        this._boundaryY = boundaryY;
        this.PartSize = partSize;
        this.Move(null);
    }

    public Move(snake: Snake)
    {
        this.X = Math.floor(Math.random() * (this._boundaryX / this.PartSize) + 1) * this.PartSize;
        this.Y = Math.floor(Math.random() * (this._boundaryY / this.PartSize) + 1) * this.PartSize;

        if (snake != null)
        {
            for(let i=0;i < snake.BodyParts.length;++i)
            {
                let currentPart = snake.BodyParts[i];
                if (currentPart.X == this.X && currentPart.Y == this.Y)
                { 
                    this.Move(snake)
                    break;
                }
            }
        }
    }
}
