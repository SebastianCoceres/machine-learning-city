import { log } from "../utils/logger.js";

class Graph {
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
    }

    addPoint(point) {
        this.points.push(point);
    }

    tryAddPoint(point) {
        if (!this.containsPoint(point)) {
            this.addPoint(point);
            log({ msg: "Point added", point, points: this.points })
            return true
        } else {
            log({ msg: "Point already exists", point, points: this.points }, "error")
            return false
        }
    }

    containsPoint(point) {
        return this.points.find(p => p.equals(point));
    }

    removePoint(point) {
        this.points = this.points.filter(p => !p.equals(point));
        for (const seg of this.getSegmentWithPoint(point)) {
            if (seg.includes(point)) {
                this.removeSegment(seg);
            }
        }
        log({ msg: "Point removed", point, points: this.points })
    }

    //Segments

    addSegment(seg) {
        this.segments.push(seg);
    }

    containsSegment(seg) {
        return this.segments.find(s => s.equals(seg));
    }

    tryAddSegment(seg) {
        if (!this.containsSegment(seg) && !seg.p1.equals(seg.p2)) {
            this.addSegment(seg);
            log({ msg: "Segment added", seg, segments: this.segments })
            return true
        } else {
            log({ msg: "Segment already exists or same point", seg, segments: this.segments }, "error")
            return false
        }
    }

    removeSegment(seg) {
        this.segments = this.segments.filter(s => !s.equals(seg));
        log({ msg: "Segment removed", seg, segments: this.segments })
    }

    getSegmentWithPoint(point) {
        return this.segments.filter(seg => seg.includes(point));
    }

    dispose() {
        this.points.length = 0;
        this.segments.length = 0;

        log({ msg: "Graph disposed" })
    }
    draw(ctx) {
        for (const seg of this.segments) {
            seg.draw(ctx);
        }

        for (const point of this.points) {
            point.draw(ctx);
        }
    }
}

export { Graph }