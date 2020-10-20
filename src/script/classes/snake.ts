import { SnakePart } from './snakepart.js';
import { Apple } from './apple.js';
import { Direction, DirectionMap } from './direction.js';

export class Snake {
    public BodyParts: Array<SnakePart> = [];
    public StartLength: number;
    public Direction: Direction = Direction.Unknown;
    private _startPositionX: number;
    private _startPositionY: number;
    private _partSize: number;
    private _directionX: number = 0;
    private _directionY: number = 0;
    private _directionMap: Array<DirectionMap> = [];

    constructor(startLength: number, startPositionX: number, startPositionY: number, partSize: number)
    {
        this.StartLength = startLength;
        this._startPositionX = startPositionX;
        this._startPositionY = startPositionY;
        this._partSize = partSize;

        this._directionMap.push(new DirectionMap(Direction.Unknown, 0,0));
        this._directionMap.push(new DirectionMap(Direction.Left, -1, 0));
        this._directionMap.push(new DirectionMap(Direction.Up, 0, -1));
        this._directionMap.push(new DirectionMap(Direction.Right, 1, 0));
        this._directionMap.push(new DirectionMap(Direction.Down, 0, 1));

        for (let i = 0;i<this.StartLength;++i)
        {
            this.BodyParts.push(new SnakePart(this._startPositionX + i * this._partSize, this._startPositionY, this._partSize));
        }
    }

    public ChangeDirection(direction:Direction)
    {
        if (Math.abs(direction - this.Direction) != 2)
        {
            let map:DirectionMap = this._directionMap.filter(x => x.Direction == direction)[0];
            this._directionX = map.X;
            this._directionY = map.Y;
            this.Direction = map.Direction;
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

    public HeadCollidesWith(apple: Apple) : boolean;
    public HeadCollidesWith(part: SnakePart) : boolean;
    public HeadCollidesWith(object:any): boolean
    {
        if (object instanceof Apple) {
            let head: SnakePart = this.BodyParts[this.BodyParts.length - 1];
            return head.X == object.X && head.Y == object.Y;
        } 
        else if (object instanceof SnakePart) {
            let head: SnakePart = this.BodyParts[this.BodyParts.length - 1];
            return object != head && head.X  == object.X && head.Y == object.Y;
        }
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
