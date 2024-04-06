import { angle } from "../math/utils";
import { Marking } from "./marking";
import { Point } from "../primitives";

export class Parking extends Marking {
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

        this.borders = [this.poly.segments[0], this.poly.segments[2]];
        this.type = "parking";
    }

    static load(info) {
        return new Parking(
            Point.load(info.center),
            Point.load(info.directionVector),
            info.width,
            info.height
        );
    }

    draw(ctx) {
        for (const border of this.borders) {
            border.draw(ctx, { width: 5, color: "white" });
        }
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector));

        ctx.beginPath();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = "bold " + this.height * 0.9 + "px sans-serif";
        ctx.fillText("P", 0, 3);

        ctx.restore();
    }
}