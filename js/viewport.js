import { Point } from "./primitives/index.js";
import { subtract, add, scale } from "./math/utils";

export class Viewport {
    constructor(canvas, world) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        if (!this.ctx) {
            throw new Error('2d rendering context is not supported');
        }

        this.width = canvas.width;
        this.height = canvas.height;
        this.zoom = world.zoom || 1;
        this.center = new Point(this.width / 2, this.height / 2,);
        this.offset = world.offset || scale(this.center, -1);

        this.drag = {
            start: new Point(0, 0),
            end: new Point(0, 0),
            offset: new Point(0, 0),
            active: false
        }

        this.#addEventListeners();
    }

    reset() {
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.center.x, this.center.y);
        this.ctx.scale(1 / this.zoom, 1 / this.zoom);
        const offset = this.getOffset();
        this.ctx.translate(offset.x, offset.y);
    }

    getMouse(evt, subtractDragOffset = false) {
        const p = new Point(
            (evt.offsetX - this.center.x) * this.zoom - this.offset.x,
            (evt.offsetY - this.center.y) * this.zoom - this.offset.y
        )

        return subtractDragOffset ? subtract(p, this.drag.offset) : p
    }

    getOffset() {
        return add(this.offset, this.drag.offset);
    }

    #addEventListeners() {
        this.canvas.addEventListener("wheel", this.#handleMouseWheel.bind(this), { passive: false });
        this.canvas.addEventListener("mousedown", this.#handleMousDown.bind(this), { passive: false });
        this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this), { passive: false });
        this.canvas.addEventListener("mouseup", this.#handleMouseUp.bind(this), { passive: false });
    }

    #handleMouseWheel(evt) {
        const dir = Math.sign(evt.deltaY);
        const step = 0.1;
        this.zoom += dir * step;
        this.zoom = Math.max(0.5, Math.min(10, this.zoom));
    }

    #handleMousDown(evt) {
        if (evt.button == 1) {
            this.drag.start = this.getMouse(evt);
            this.drag.active = true;
        }
    }

    #handleMouseMove(evt) {
        if (this.drag.active) {
            this.drag.end = this.getMouse(evt);
            this.drag.offset = subtract(this.drag.end, this.drag.start);
        }
    }

    #handleMouseUp(evt) {
        if (this.drag.active) {
            this.offset = add(this.offset, this.drag.offset);
            this.drag = {
                start: new Point(0, 0),
                end: new Point(0, 0),
                offset: new Point(0, 0),
                active: false
            }
        }
    }

}