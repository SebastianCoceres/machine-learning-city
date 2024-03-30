import { Segment } from "./segment.js";
import { Point } from "./point.js";
import { getIntersection } from "../math/utils.js";

export class Polygon {
    constructor(points) {
        this.points = points;
        this.segments = [];
        for (let i = 1; i <= points.length - 1; i++) {
            this.segments.push(
                new Segment(points[i - 1], points[i % points.length])
            )
        }
    }

    static break(p1, p2) {
        const segments1 = p1.segments;
        const segments2 = p2.segments;

        const intersections = [];

        for (let i = 0; i < segments1.length; i++) {
            for (let j = 0; j < segments2.length; j++) {
                const intersection = getIntersection(
                    segments1[i].p1, segments1[i].p2, segments2[j].p1, segments2[j].p2
                );

                if (intersection && intersection.offset != 1 && intersection.offset != 0) {
                    const point = new Point(intersection.x, intersection.y);
                    intersections.push(point);
                }
            }
        }

        return intersections;
    }

    draw(ctx, { stroke = "#404040", lineWidth = 1, fill = "rgba(0,0,255,0.3)" } = {}) {
        ctx.beginPath();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.fillStyle = fill;
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (const point of this.points) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
}