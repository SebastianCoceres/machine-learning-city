import { Graph } from "./js/math/graph.js";
import { Point } from "./js/primitives/point.js";
import { Segment } from "./js/primitives/segment.js";

const vwCanvas = document.querySelector("#virtualWorldCanvas");

vwCanvas.width = window.innerWidth;
vwCanvas.height = window.innerHeight;
console.log(vwCanvas.width, vwCanvas.height);
const vwCtx = vwCanvas.getContext("2d");

// const p1 = new Point(200, 200);
// const p2 = new Point(500, 200);
// const p3 = new Point(400, 400);
// const p4 = new Point(100, 300);

// const s1 = new Segment(p1, p2);
// const s2 = new Segment(p1, p3);
// const s3 = new Segment(p1, p4);
// const s4 = new Segment(p2, p3);

const graph = new Graph([], []);

function redraw() {
    vwCtx.clearRect(0, 0, vwCanvas.width, vwCanvas.height);
    graph.draw(vwCtx);
}
function addRandomPoint() {
    graph.tryAddPoint(
        new Point(
            Math.floor(Math.random() * vwCanvas.width),
            Math.floor(Math.random() * vwCanvas.height),
        )
    )

    redraw()
}

function removeRandomPoint() {
    if (graph.points.length < 1) return console.error("Cannot remove point with less than 1 point")
    const index = Math.floor(Math.random() * graph.points.length);
    graph.removePoint(graph.points[index]);

    redraw()
}

function addRandomSegment() {
    if (graph.points.length < 2) return console.error("Cannot add segment with less than 2 points")
    const index1 = Math.floor(Math.random() * graph.points.length);
    const index2 = Math.floor(Math.random() * graph.points.length);
    const success = graph.tryAddSegment(
        new Segment(graph.points[index1], graph.points[index2])
    );

    if (success) {
        console.log({
            msg: "Segment added",
        })
    } else {
        console.log({
            msg: "Cannot add segment to same point",
        })
    }

    redraw()
}

function removeRandomSegment() {
    if (graph.segments.length < 1) return console.error("Cannot remove segment with less than 1 point")
    const index = Math.floor(Math.random() * graph.segments.length);
    graph.removeSegment(graph.segments[index]);

    redraw()
}

function removeAll() {
    graph.dispose();
    redraw();
}


document.querySelector("#addRandomPoint").addEventListener("click", addRandomPoint);
document.querySelector("#removeRandomPoint").addEventListener("click", removeRandomPoint);

document.querySelector("#addRandomSegment").addEventListener("click", addRandomSegment);
document.querySelector("#removeRandomSegment").addEventListener("click", removeRandomSegment);

document.querySelector("#removeAll").addEventListener("click", removeAll);

graph.draw(vwCtx);
