import { Segment } from "./segment.js";
import { Point } from "./point.js";
import { getIntersection, getRandomColor, average } from "../math/utils.js";

export class Polygon {
    constructor(points) {
        this.points = points;
        this.segments = [];
        for (let i = 1; i <= points.length; i++) {
            this.segments.push(
                new Segment(points[i - 1], points[i % points.length])
            )
        }
    }

    static union(polygons) {
        Polygon.multibreak(polygons)
        const keptSegments = []

        for (let i = 0; i < polygons.length; i++) {
            for (const segment of polygons[i].segments) {
                let keep = true;
                for (let j = 0; j < polygons.length; j++) {
                    if (i != j) {
                        if (polygons[j].containsSegment(segment)) {
                            keep = false
                            break;
                        }
                    }
                }
                if (keep) {
                    keptSegments.push(segment)
                }

            }
        }
        return keptSegments
    }

    static multibreak(polygons) {
        for (let i = 0; i < polygons.length - 1; i++) {
            for (let j = i + 1; j < polygons.length; j++) {
                Polygon.break(polygons[i], polygons[j])
            }
        }
    }

    static break(p1, p2) {
        const segments1 = p1.segments;
        const segments2 = p2.segments;

        for (let i = 0; i < segments1.length; i++) {
            for (let j = 0; j < segments2.length; j++) {
                const intersection = getIntersection(
                    segments1[i].p1, segments1[i].p2, segments2[j].p1, segments2[j].p2
                );

                if (intersection && intersection.offset != 1 && intersection.offset != 0) {
                    const point = new Point(intersection.x, intersection.y);
                    let aux = segments1[i].p2
                    segments1[i].p2 = point
                    segments1.splice(i + 1, 0, new Segment(point, aux))

                    aux = segments2[j].p2
                    segments2[j].p2 = point
                    segments2.splice(j + 1, 0, new Segment(point, aux))
                }
            }
        }

    }

    containsSegment(seg) {
        const midPoint = average(seg.p1, seg.p2);
        return this.containsPoint(midPoint);
    }

    containsPoint(point) {
        const outerPoint = new Point(-1000, -1000);
        let intersectionCount = 0;
        for (const segment of this.segments) {
            const intersection = getIntersection(outerPoint, point, segment.p1, segment.p2);
            if (intersection) {
                intersectionCount++;
            }
        }
        return intersectionCount % 2 == 1
    }

    drawSegments(ctx) {
        for (const segment of this.segments) {
            segment.draw(ctx, { color: getRandomColor(), width: 5 });
        }
    }

    intersects(polygon) {
        for (let segment1 of this.segments) {
            for (let segment2 of polygon.segments) {
                if (getIntersection(segment1.p1, segment1.p2, segment2.p1, segment2.p2)) {
                    return true
                }
            }
        }
        return false
    }

    distanceToPoint(point) {
        return Math.min(...this.segments.map(s => s.distanceToPoint(point)))
    }

    distanceToPoly(polygon) {
        return Math.min(...this.points.map(p => polygon.distanceToPoint(p)))
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