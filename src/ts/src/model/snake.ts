class Snake {
    public BodyParts: Array<SnakePart>;
    public StartLength: number;
    private _startPositionX: number;
    private _startPositionY: number;
    private _partSize: number;
    public DirectionX: number = 0;
    public DirectionY: number = 0;

    constructor(startLength: number, startPositionX: number, startPositionY: number, partSize: number)
    {
        this.StartLength = startLength;
        this._startPositionX = startPositionX;
        this._startPositionY = startPositionY;
        this._partSize = partSize;
        this.Init();
    }

    private Init()
    {
        for (let i = 0;i<this.StartLength;++i)
        {
            this.BodyParts.push(new SnakePart(this._startPositionX + i * this._partSize, this._startPositionY, this._partSize));
        }
    }

    public Move()
    {
        this.BodyParts.shift();
        let head: SnakePart = this.BodyParts[this.BodyParts.length - 1];
        this.BodyParts.push(new SnakePart(head.X + (head.PartSize * this.DirectionX), head.Y + (head.PartSize * this.DirectionY), head.PartSize));
    }

    public CollidesWith(apple: Apple) : boolean {
        let head: SnakePart = this.BodyParts[this.BodyParts.length - 1];
        return head.X == apple.X && head.Y == apple.Y;
    }

    public AddPartToTail()
    {
        let tail: SnakePart = this.BodyParts[0];
        this.BodyParts.unshift(new SnakePart(tail.X - tail.PartSize, tail.Y, tail.PartSize))
    }
}
