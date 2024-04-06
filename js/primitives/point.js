class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static load(info) {
        return new Point(info.x, info.y);
    }

    draw(ctx, { size = 14, color = "#202020", outline = false, fill = false } = {}) {
        const rad = size / 2;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, rad, 0, 2 * Math.PI);
        if (outline) {
            ctx.beginPath();
            ctx.lineWidth = 6;
            ctx.strokeStyle = "#0aa";
            ctx.arc(this.x, this.y, rad * 0.5, 0, 2 * Math.PI);
            ctx.stroke();
        }

        if (fill) {
            ctx.beginPath();
            ctx.fillStyle = "#0aa";
            ctx.arc(this.x, this.y, rad * 0.4, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.fill();
    }

    equals(point) {
        return this.x === point.x && this.y === point.y
    }
}

export { Point }
export default Point;