import { Polygon } from "../primitives/polygon.js";
import { getFake3dPoint, lerp2D, lerp, translate } from "../math/utils.js";

export class Tree {
    constructor(center, size, height = 200) {
        this.center = center;
        this.size = size; //size of the base
        this.height = height;
        this.base = this.#generateLevel(center, size)
    }

    #generateLevel(point, size) {
        const points = [];
        const radius = size / 2;
        for (let i = 0; i < Math.PI * 2; i += Math.PI / 16) {
            const kindOfRandom = Math.cos(((i + this.center.x) * size) % 17) ** 2;
            const noisyRad = radius * lerp(0.5, 1, kindOfRandom);
            points.push(translate(point, i, noisyRad));
        }

        return new Polygon(points);
    }

    draw(ctx, viewpoint) {
        const top = getFake3dPoint(this.center, viewpoint, this.height);

        const levels = 13;
        for (let level = 0; level < levels; level++) {
            const t = level / (levels - 1)
            const point = lerp2D(this.center, top, t);
            const color = `rgb(30, ${lerp(50, 200, t)}, 70)`;
            const size = lerp(this.size, 80, t)
            const polygon = this.#generateLevel(point, size);
            polygon.draw(ctx, { fill: color, stroke: "rgba(0, 0, 0, 0)" });
        }
    }
}