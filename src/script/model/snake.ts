import { SnakePart } from './snakepart.js';
import { Apple } from './apple.js';
import { Direction, DirectionMap } from './direction.js';

export class Snake {
    private _currentDirectionMap = new DirectionMap(Direction.Unknown, 0, 0);
    private _startPositionX: number;
    private _startPositionY: number;
    private _partSize: number;
    private _directionMap: Array<DirectionMap> = [];
    private _startLength: number;
    private _bodyParts: Array<SnakePart> = [];

    constructor(startLength: number, startPositionX: number, startPositionY: number, partSize: number)
    {
        this._startLength = startLength;
        this._startPositionX = startPositionX;
        this._startPositionY = startPositionY;
        this._partSize = partSize;

        this._directionMap.push(new DirectionMap(Direction.Unknown, 0,0));
        this._directionMap.push(new DirectionMap(Direction.Left, -1, 0));
        this._directionMap.push(new DirectionMap(Direction.Up, 0, -1));
        this._directionMap.push(new DirectionMap(Direction.Right, 1, 0));
        this._directionMap.push(new DirectionMap(Direction.Down, 0, 1));

        for (let i = 0;i<this._startLength;++i)
        {
            this._bodyParts.push(new SnakePart(this._startPositionX + i * this._partSize, this._startPositionY, this._partSize));
        }
    }

    public GetBodyParts() : Array<SnakePart>
    {
        return this._bodyParts;
    }

    public GetCurrentDirection() : Direction
    {
        return this._currentDirectionMap.Direction;
    }

    public ChangeDirection(direction:Direction)
    {
        if (Math.abs(direction - this._currentDirectionMap.Direction) != 2)
        {
            let map:DirectionMap = this._directionMap.filter(x => x.Direction == direction)[0];
            if (map != null)
            {
                this._currentDirectionMap = map;
            }
        }
    }

    public Move()
    {
        this._bodyParts.shift();
        let head: SnakePart = this._bodyParts[this._bodyParts.length - 1];
        this._bodyParts.push(new SnakePart(head.X + (head.PartSize * this._currentDirectionMap.X), head.Y + (head.PartSize * this._currentDirectionMap.Y), head.PartSize));
    }

    public HeadCollidesWith(apple: Apple) : boolean;
    public HeadCollidesWith(part: SnakePart) : boolean;
    public HeadCollidesWith(object:any): boolean
    {
        if (object instanceof Apple) {
            let head: SnakePart = this._bodyParts[this._bodyParts.length - 1];
            return head.X == object.X && head.Y == object.Y;
        } 
        else if (object instanceof SnakePart) {
            let head: SnakePart = this._bodyParts[this._bodyParts.length - 1];
            return object != head && head.X  == object.X && head.Y == object.Y;
        }
    }

    public BodyCollidesWith(apple: Apple) : boolean {
        for(let i=0;i < this._bodyParts.length;++i)
        {
            let currentPart = this._bodyParts[i];
            if (currentPart.X == apple.X && currentPart.Y == apple.Y)
            { 
                return true
            }
        }
        return false;
    }

    public ResetSnake()
    {
        this._bodyParts.splice(0, this._bodyParts.length - this._startLength);
    }

    public AddPartToTail()
    {
        let tail: SnakePart = this._bodyParts[0];
        this._bodyParts.unshift(new SnakePart(tail.X - tail.PartSize, tail.Y, tail.PartSize))
    }

    public HandleCollision(screen:HTMLCanvasElement)
    {
        for(let i=0;i < this._bodyParts.length;++i)
        {
            let part = this._bodyParts[i];
            if (this.HeadCollidesWith(part)) 
            { 
                this.ResetSnake();
            }

            this.HandleBorderCollision(screen, part)
        } 
    }

    private HandleBorderCollision(screen:HTMLCanvasElement, part: SnakePart)
    {
        if (part.X == screen.width)
        {
            part.X = 0;
        }
        else if (part.X == 0 - part.PartSize)
        {
            part.X = screen.width - part.PartSize;
        }
        else if (part.Y == screen.height)
        {
            part.Y = 0;
        }
        else if (part.Y == 0 - part.PartSize)
        {
            part.Y = screen.height - part.PartSize;
        }   
    }
}
