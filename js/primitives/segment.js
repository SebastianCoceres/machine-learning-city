class Segment {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    draw(ctx, { width = 1, color = "#a0a0a0", dash = [], gap = 0 } = {}) {
        const deltaX = this.p2.x - this.p1.x;
        const deltaY = this.p2.y - this.p1.y;
        const gapX = deltaX * gap;
        const gapY = deltaY * gap;

        const startX = this.p1.x + gapX;
        const startY = this.p1.y + gapY;
        const endX = this.p2.x - gapX;
        const endY = this.p2.y - gapY;

        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        if (dash.length) {
            ctx.setLineDash(dash);
        }
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    equals(seg) {
        return this.includes(seg.p1) && this.includes(seg.p2)
    }

    includes(point) {
        return this.p1.equals(point) || this.p2.equals(point)
    }


}

export { Segment }
export default Segment