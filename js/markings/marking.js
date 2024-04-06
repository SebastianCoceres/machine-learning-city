import { angle, translate } from "../math/utils";
import { Envelope, Segment } from "../primitives";
import {
    Crossing, Light,
    Stop,
    Target,
    Parking,
    Start,
    Yield
} from "./index";
import { log } from "../utils/logger"

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
        this.type = "marking";
    }

    static load(info) {
        switch (info.type) {
            case "crossing":
                return Crossing.load(info);
            case "light":
                return Light.load(info);
            case "stop":
                return Stop.load(info);
            case "target":
                return Target.load(info);
            case "parking":
                return Parking.load(info)
            case "start":
                return Start.load(info);
            case "yield":
                return Yield.load(info);
            default:
                log("unknown marking type: " + info.type)
                return
        }
    }

    draw(ctx, options) {
        this.poly.draw(ctx, options)
    }
}