import { add, scale, perpendicular } from "../math/utils";
import { Segment, Point } from "../primitives";
import { Marking } from "./marking";

export class Crossing extends Marking {
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);
        this.borders = [this.poly.segments[0], this.poly.segments[2]]
        this.type = "crossing";
    }

    static load(info) {
        return new Crossing(
            Point.load(info.center),
            Point.load(info.directionVector),
            info.width,
            info.height
        );
    }

    draw(ctx, options) {
        const perpLine = perpendicular(this.directionVector)
        const line = new Segment(
            add(this.center, scale(perpLine, this.width / 2)),
            add(this.center, scale(perpLine, -this.width / 2))
        )
        line.draw(ctx, { ...options, width: this.height, color: "white", dash: [11, 11] })

    }
}