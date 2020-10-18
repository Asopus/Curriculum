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
        this.Move();
    }

    public Move()
    {
        this.X = Math.floor(Math.random() * (this._boundaryX / this.PartSize) + 1) * this.PartSize;
        this.Y = Math.floor(Math.random() * (this._boundaryY / this.PartSize) + 1) * this.PartSize;

        // for(let i=0;i < snake.length;++i)
        // {
        //     currentPart = snake[i];
        //     if (currentPart.x == appleX && currentPart.y == appleY)
        //     { 
        //         moveApple()
        //         break;
        //     }
        // }
    }
}
