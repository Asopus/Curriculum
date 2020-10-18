import { SnakePart } from './snakepart.js';
export class Snake {
    constructor(startLength, startPositionX, startPositionY, partSize) {
        this.BodyParts = [];
        this.DirectionX = 0;
        this.DirectionY = 0;
        this.StartLength = startLength;
        this._startPositionX = startPositionX;
        this._startPositionY = startPositionY;
        this._partSize = partSize;
        this.Init();
    }
    Init() {
        for (let i = 0; i < this.StartLength; ++i) {
            this.BodyParts.push(new SnakePart(this._startPositionX + i * this._partSize, this._startPositionY, this._partSize));
        }
    }
    Move() {
        this.BodyParts.shift();
        let head = this.BodyParts[this.BodyParts.length - 1];
        this.BodyParts.push(new SnakePart(head.X + (head.PartSize * this.DirectionX), head.Y + (head.PartSize * this.DirectionY), head.PartSize));
    }
    CollidesWith(apple) {
        let head = this.BodyParts[this.BodyParts.length - 1];
        return head.X == apple.X && head.Y == apple.Y;
    }
    AddPartToTail() {
        let tail = this.BodyParts[0];
        this.BodyParts.unshift(new SnakePart(tail.X - tail.PartSize, tail.Y, tail.PartSize));
    }
}
