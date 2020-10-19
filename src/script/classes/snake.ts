import { SnakePart } from './snakepart.js';
import { Apple } from './apple.js';
import { Direction } from './direction.js';

export class Snake {
    public BodyParts: Array<SnakePart> = [];
    public StartLength: number;
    public Direction: Direction = Direction.Unknown;
    private _startPositionX: number;
    private _startPositionY: number;
    private _partSize: number;
    private _directionX: number = 0;
    private _directionY: number = 0;

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

    public GoLeft()
    {
        this._directionX = -1;
        this._directionY = 0;
        this.Direction = Direction.Left;
    }

    public GoRight()
    {
        this._directionX = 1;
        this._directionY = 0;
        this.Direction = Direction.Right;
    }

    public GoUp()
    {
        this._directionX = 0;
        this._directionY = -1;
        this.Direction = Direction.Up;
    }

    public GoDown()
    {
        this._directionX = 0;
        this._directionY = 1;
        this.Direction = Direction.Down;
    }

    public Stop()
    {
        this._directionX = 0;
        this._directionY = 0;
        this.Direction = Direction.Unknown;
    }

    public Move()
    {
        this.BodyParts.shift();
        let head: SnakePart = this.BodyParts[this.BodyParts.length - 1];
        this.BodyParts.push(new SnakePart(head.X + (head.PartSize * this._directionX), head.Y + (head.PartSize * this._directionY), head.PartSize));
    }

    public HeadCollidesWith(apple: Apple) : boolean {
        let head: SnakePart = this.BodyParts[this.BodyParts.length - 1];
        return head.X == apple.X && head.Y == apple.Y;
    }

    public BodyCollidesWith(apple: Apple) : boolean {
        for(let i=0;i < this.BodyParts.length;++i)
        {
            let currentPart = this.BodyParts[i];
            if (currentPart.X == apple.X && currentPart.Y == apple.Y)
            { 
                return true
            }
        }
        return false;
    }

    public HeadCollidesWithPart(part: SnakePart) : boolean
    {
        let head: SnakePart = this.BodyParts[this.BodyParts.length - 1];
        
        if (part != head && head.X  == part.X && head.Y == part.Y) 
        { 
            return true;
        }

        return false;
    }

    public ResetSnake()
    {
        this.BodyParts.splice(0, this.BodyParts.length - this.StartLength);
    }

    public AddPartToTail()
    {
        let tail: SnakePart = this.BodyParts[0];
        this.BodyParts.unshift(new SnakePart(tail.X - tail.PartSize, tail.Y, tail.PartSize))
    }
}
