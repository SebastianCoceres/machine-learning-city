import { getNearestPoint, getNearestSegment } from "./math/utils";
import { Segment } from "./primitives/segment";
import { drawingStatus, drawingStatusLabel } from "./elements";

export class GraphEditor {
    constructor(viewport, graph) {
        this.viewport = viewport;
        this.canvas = viewport.canvas;
        this.graph = graph;
        this.ctx = this.canvas.getContext("2d");

        this.selectedPoint = null;
        this.hoveredPoint = null;
        this.selectedSegment = null;
        this.hoveredSegment = null;
        this.mousePoint = null;
        this.mouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;

        this.dragging = false;
        this.isDrawing = false;

        this.#addEventListeners();

    }

    #removePoint(point) {
        this.graph.removePoint(point);
        this.hoveredPoint = null
        if (this.selectedPoint === point) {
            this.selectedPoint = null
        }
    }

    #removeSegment(point) {
        this.graph.removeSegment(point);
        this.hoveredSegment = null
        if (this.selectedSegment === point) {
            this.selectedSegment = null
        }
    }

    #selectPoint(point) {
        if (this.selectedPoint) {
            this.graph.tryAddSegment(new Segment(this.selectedPoint, point));
        }
        this.selectedPoint = point
    }

    #handleMouseDown(evt) {
        if (evt.button == 2) {
            if (this.selectedPoint) {
                this.selectedPoint = null
            } else if (this.hoveredPoint) {
                this.#removePoint(this.hoveredPoint)
            } else if (this.hoveredSegment) {
                this.#removeSegment(this.hoveredSegment)
            }
            this.#toggleIsDrawing(false)
        }

        if (evt.button == 0) {
            if (this.isDrawing) {
                if (this.hoveredPoint) {
                    this.#selectPoint(this.hoveredPoint);
                    this.dragging = true;
                    return;
                }

                this.graph.addPoint(this.mousePoint);
                this.#selectPoint(this.mousePoint)
                this.hoveredPoint = this.mousePoint
            }

            if (evt.detail == 2) {
                this.#toggleIsDrawing(true)
            }

        }
    }

    #handleMouseMove(evt) {
        this.mousePoint = this.viewport.getMouse(evt, true)
        this.hoveredPoint = getNearestPoint(this.mousePoint, this.graph.points, 10 * this.viewport.zoom);
        this.hoveredSegment = getNearestSegment(this.mousePoint, this.graph.segments, 10 * this.viewport.zoom);

        if (this.dragging) {
            this.selectedPoint.x = this.mousePoint.x
            this.selectedPoint.y = this.mousePoint.y
        }
    }

    #addEventListeners() {
        this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
        this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
        this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault())
        this.canvas.addEventListener("mouseup", () => this.dragging = false)
        document.addEventListener("keyup", (evt) => {
            if ((evt.ctrlKey || evt.metaKey) && evt.key === 'z') {
                this.graph.undo();
                this.#toggleIsDrawing(false)
                this.selectedPoint = null
                this.hoveredPoint = null
                evt.preventDefault();
            }

            if (evt.key === 'Escape') {
                this.#toggleIsDrawing(false)
                this.selectedPoint = null
                this.hoveredPoint = null
            }
        })
    }

    #toggleIsDrawing(isDrawing) {
        this.isDrawing = isDrawing
        drawingStatus.checked = this.isDrawing ? true : false
        drawingStatusLabel.textContent = this.isDrawing ? "On" : "Off"
    }

    dispose() {
        this.graph.dispose()
        this.selectedPoint = null;
        this.hoveredPoint = null;
        this.selectedSegment = null;
    }

    save() {
        localStorage.setItem("graph", JSON.stringify(this.graph))
    }

    display() {
        this.graph.draw(this.ctx);
        if (this.selectedPoint) {
            const intent = this.hoveredPoint ? this.hoveredPoint : this.mousePoint
            new Segment(this.selectedPoint, intent).draw(this.ctx, { width: 4, color: "#ff3838", dash: [3, 3] });
            this.selectedPoint.draw(this.ctx, { outline: true });
        }
        if (this.hoveredPoint) {
            this.hoveredPoint.draw(this.ctx, { fill: true });
        }
        if (this.hoveredSegment) {
            this.hoveredSegment.draw(this.ctx, { width: 2, color: "red", gap: 0.05 });
        }
    }

}

