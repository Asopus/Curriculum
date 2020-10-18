export class Apple {
    constructor(boundaryX, boundaryY, partSize) {
        this._boundaryX = boundaryX;
        this._boundaryY = boundaryY;
        this.PartSize = partSize;
        this.Move();
    }
    Move() {
        this.X = Math.floor(Math.random() * (this._boundaryX / this.PartSize) + 1) * this.PartSize;
        this.Y = Math.floor(Math.random() * (this._boundaryY / this.PartSize) + 1) * this.PartSize;
    }
}
