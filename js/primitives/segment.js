import { distance, subtract, normalize, dot, scale, magnitude, add } from "../math/utils.js";
import Point from "./point.js";

class Segment {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    static load(info) {
        return new Segment(
            Point.load(info.p1),
            Point.load(info.p2)
        );
    }

    draw(ctx, { width = 2, color = "#808080", dash = [], gap = 0, cap = "butt" } = {}) {
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
        ctx.lineCap = cap;
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

    length() {
        return distance(this.p1, this.p2)
    }

    directionVector() {
        return normalize(subtract(this.p2, this.p1))
    }

    distanceToPoint(point) {
        const proj = this.projectPoint(point);
        if (proj.offset > 0 && proj.offset < 1) {
            return distance(proj.point, point)
        }
        const distToP1 = distance(point, this.p1);
        const distToP2 = distance(point, this.p2);

        return Math.min(distToP1, distToP2)
    }

    projectPoint(point) {
        const a = subtract(point, this.p1);
        const b = subtract(this.p2, this.p1);
        const normB = normalize(b);
        const scaler = dot(a, normB);

        const proj = {
            point: add(this.p1, scale(normB, scaler)),
            offset: scaler / magnitude(b)
        }

        return proj

    }


}

export { Segment }
export default Segment