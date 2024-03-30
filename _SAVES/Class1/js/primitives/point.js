class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx, size = 18, color = "white") {
        const rad = size / 2;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, rad, 0, 2 * Math.PI);
        ctx.fill();
    }

    equals(point) {
        return this.x === point.x && this.y === point.y
    }
}

export { Point }
export default Point;