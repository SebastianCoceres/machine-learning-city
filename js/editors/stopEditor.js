import { getNearestSegment } from "../math/utils";
import { Stop } from "../markings/stop";

export class StopEditor {
    constructor(viewport, world) {
        this.viewport = viewport;
        this.world = world;

        this.canvas = viewport.canvas;
        this.ctx = this.canvas.getContext("2d");

        this.mousePoint = null;
        this.intent = null;

        this.markings = world.markings;
    }

    #addEventListeners() {
        this.boundMouseDown = this.#handleMouseDown.bind(this)
        this.boundMouseMove = this.#handleMouseMove.bind(this)
        this.boundContextMenu = (evt) => evt.preventDefault()
        this.canvas.addEventListener("mousedown", this.boundMouseDown);
        this.canvas.addEventListener("mousemove", this.boundMouseMove);
        this.canvas.addEventListener("contextmenu", this.boundContextMenu)
        document.addEventListener("keyup", (evt) => {
            if ((evt.ctrlKey || evt.metaKey) && evt.key === 'z') {
                this.graph.undo();

                this.selectedPoint = null
                this.hoveredPoint = null
                evt.preventDefault();
            }

            if (evt.key === 'Escape') {

                this.selectedPoint = null
                this.hoveredPoint = null
            }
        })
    }

    #removeEventListeners() {
        this.canvas.removeEventListener("mousedown", this.boundMouseDown);
        this.canvas.removeEventListener("mousemove", this.boundMouseMove);
        this.canvas.removeEventListener("contextmenu", this.boundContextMenu)

        document.removeEventListener("keyup", (evt) => {
            if ((evt.ctrlKey || evt.metaKey) && evt.key === 'z') {
                this.graph.undo();

                this.selectedPoint = null
                this.hoveredPoint = null
                evt.preventDefault();
            }

            if (evt.key === 'Escape') {

                this.selectedPoint = null
                this.hoveredPoint = null
            }
        })
    }

    #handleMouseDown(evt) {
        if (evt.button === 0) {
            if (this.intent) {
                this.markings.push(this.intent);
                this.intent = null;
            }
        }
        if (evt.button === 2) {
            for (let i = 0; i < this.markings.length; i++) {
                if (this.markings[i].poly.containsPoint(this.mousePoint)) {
                    this.markings.splice(i, 1);
                    i--;
                    return
                }
            }
        }
    }

    #handleMouseMove(evt) {
        this.mousePoint = this.viewport.getMouse(evt, true)
        const seg = getNearestSegment(this.mousePoint, this.world.laneGuides, 10 * this.viewport.zoom)
        if (seg) {
            const proj = seg.projectPoint(this.mousePoint);
            if (proj.offset >= 0 && proj.offset <= 1) {
                this.intent = new Stop(
                    proj.point,
                    seg.directionVector(),
                    this.world.roadWidth / 2,
                    this.world.roadWidth / 2
                )
            } else {
                this.intent = null
            }
        } else {
            this.intent = null
        }
    }


    display() {
        if (this.intent) {

            this.intent.draw(this.ctx)
        }
    }

    enable() {
        this.#addEventListeners();
    }

    disable() {
        this.#removeEventListeners();
    }
}