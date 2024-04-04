import { GraphEditor } from "./js/editors/graphEditor.js";
import { StopEditor } from "./js/editors/stopEditor.js";
import { Graph } from "./js/math/graph.js";
import { log } from "./js/utils/logger.js";
import { Viewport } from "./js/viewport.js";
import { World } from "./js/world.js";
import { scale } from "./js/math/utils.js";
import {
    resetBtn,
    saveBtn,
    graphModeBtn,
    stopModeBtn
} from "./js/elements.js";

const vwCanvas = document.querySelector("#virtualWorldCanvas");

vwCanvas.width = window.innerWidth;
vwCanvas.height = window.innerHeight;

log({ msg: "Canvas size", width: vwCanvas.width, height: vwCanvas.height })

const graphSaved = localStorage.getItem("graph");
const grapshInfo = graphSaved ? JSON.parse(graphSaved) : null
const graph = grapshInfo
    ? Graph.load(grapshInfo)
    : new Graph();
const world = new World(graph);
const viewport = new Viewport(vwCanvas)
const graphEditor = new GraphEditor(viewport, graph);
const stopEditor = new StopEditor(viewport, world);

let oldGraphHash = graph.hash();

setMode("graph");
animate()

function animate() {
    viewport.reset();
    if (graph.hash() !== oldGraphHash) {
        world.generate();
        oldGraphHash = graph.hash();
    }
    const viewpoint = scale(viewport.getOffset(), -1);
    world.draw(viewport.ctx, viewpoint);
    viewport.ctx.globalAlpha = 0.5;
    graphEditor.display();
    stopEditor.display();
    requestAnimationFrame(animate);
}

function setMode(mode) {
    dissableEditors();
    switch (mode) {
        case "graph":
            graphModeBtn.classList.remove("disabled");
            graphEditor.enable();
            break;
        case "stop":
            stopModeBtn.classList.remove("disabled");
            stopEditor.enable();
            break;
    }
}

function dissableEditors() {
    graphModeBtn.classList.add("disabled");
    graphEditor.disable();
    stopModeBtn.classList.add("disabled");
    stopEditor.disable();
}

console.log(world)

resetBtn.addEventListener("click", () => {
    graphEditor.dispose()
    world.markings.length = 0
})
saveBtn.addEventListener("click", () => {
    graphEditor.save()
})
graphModeBtn.addEventListener("click", () => {
    setMode("graph");
})
stopModeBtn.addEventListener("click", () => {
    setMode("stop");
})
