export enum Direction {
  Unknown = 32,
  Left = 37,
  Up = 38,
  Right = 39,
  Down = 40,
}

export class DirectionMap 
{
  constructor(Direction:Direction, X:number, Y:number) 
  {
      this.Direction = Direction;
      this.X = X;
      this.Y = Y;
  }

    public Direction:Direction;
    public X:number;
    public Y:number;
}
