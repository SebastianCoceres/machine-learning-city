import { perpendicular, add, scale, lerp2D } from "../math/utils";
import { Marking } from "./marking";
import { Segment, Point } from "../primitives/index";
import { log } from "../utils/logger";

export class Light extends Marking {
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height / 2);
        this.state = "red";
        this.border = this.poly.segments[0];
        this.type = "light";
    }

    static load(info) {

        return new Light(
            Point.load(info.center),
            Point.load(info.directionVector),
            info.width,
            info.height * 2
        );
    }

    draw(ctx) {
        const perp = perpendicular(this.directionVector);
        const line = new Segment(
            add(this.center, scale(perp, this.width / 2)),
            add(this.center, scale(perp, -this.width / 2))
        );

        const green = lerp2D(line.p1, line.p2, 0.2);
        const yellow = lerp2D(line.p1, line.p2, 0.5);
        const red = lerp2D(line.p1, line.p2, 0.8);

        new Segment(red, green).draw(ctx, {
            width: this.height,
            cap: "round"
        });

        green.draw(ctx, { size: this.height * 0.6, color: "#060" });
        yellow.draw(ctx, { size: this.height * 0.6, color: "#660" });
        red.draw(ctx, { size: this.height * 0.6, color: "#600" });

        switch (this.state) {
            case "green":
                green.draw(ctx, { size: this.height * 0.6, color: "#0F0" });
                break;
            case "yellow":
                yellow.draw(ctx, { size: this.height * 0.6, color: "#FF0" });
                break;
            case "red":
                red.draw(ctx, { size: this.height * 0.6, color: "#F00" });
                break;
        }
    }
}