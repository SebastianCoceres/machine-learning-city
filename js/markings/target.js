import { Marking } from "./marking";
import {Point} from "../primitives";

export class Target extends Marking {
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);
        this.type = "target";
    }

    static load(info) {
        return new Target(
            Point.load(info.center),
            Point.load(info.directionVector),
            info.width,
            info.height
        );
    }

    draw(ctx) {
        this.center.draw(ctx, { color: "red", size: 30 });
        this.center.draw(ctx, { color: "white", size: 20 });
        this.center.draw(ctx, { color: "red", size: 10 });
    }
}