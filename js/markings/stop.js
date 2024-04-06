import { angle } from "../math/utils";
import { Marking } from "./marking";
import { Point } from "../primitives";

export class Stop extends Marking {
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);
        this.border = this.poly.segments[2]
        this.type = "stop";
    }

    static load(info) {
        return new Stop(
            Point.load(info.center),
            Point.load(info.directionVector),
            info.width,
            info.height
        );
    }

    draw(ctx, options) {
        this.border.draw(ctx, { ...options, width: 5, color: "white" })
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector) - Math.PI / 2);
        ctx.scale(1, 3);

        ctx.beginPath();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = `bold ${this.height / 3}px sans-serif`;
        ctx.fillText("STOP", 0, 1);

        ctx.restore()
    }
}