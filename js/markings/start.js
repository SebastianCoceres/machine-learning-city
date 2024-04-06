import { angle } from "../math/utils";
import { Marking } from "./marking";
import { Point } from "../primitives";

export class Start extends Marking {
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);
        this.img = new Image();
        this.img.src = "assets/car.png"
        this.type = "start";
    }

    static load(info) {
        return new Start(
            Point.load(info.center),
            Point.load(info.directionVector),
            info.width,
            info.height
        );
    }

    draw(ctx, options) {
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector) - Math.PI / 2);

        ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);

        ctx.restore()

    }
}