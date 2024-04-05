import { angle, translate } from "../math/utils";
import { Envelope } from "../primitives/envelope";
import Segment from "../primitives/segment";

export class Marking {
    constructor(center, directionVector, width, height) {
        this.center = center;
        this.directionVector = directionVector;
        this.width = width;
        this.height = height;

        this.support = new Segment(
            translate(this.center, angle(this.directionVector), height / 2),
            translate(this.center, angle(this.directionVector), -height / 2)
        )

        this.poly = new Envelope(this.support, width, 0).poly
    }

    draw(ctx, options) {
        this.poly.draw(ctx, options)
    }
}