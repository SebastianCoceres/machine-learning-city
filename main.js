import { GraphEditor } from "./js/graphEditor.js";
import { Graph } from "./js/math/graph.js";
import { log } from "./js/utils/logger.js";
import { Viewport } from "./js/viewport.js";
import { World } from "./js/world.js";
import { scale } from "./js/math/utils.js";


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

let oldGraphHash = graph.hash();
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
    requestAnimationFrame(animate);
}

console.log(world)

document.querySelector("#reset").addEventListener("click", () => {
    graphEditor.dispose()
})
document.querySelector("#save").addEventListener("click", () => {
    graphEditor.save()
})
