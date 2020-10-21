
export class GameConfiguration {
    public ScreenId:string;
    public ScreenWidth:number;
    public ScreenHeight:number;
    public StartLength:number;
    public PartSize:number;
    public StartX:number;
    public StartY:number;
    public Type:GameType;
    public TicksPerSecond:number;
}

export enum GameType
{
    Desktop,
    Mobile
}