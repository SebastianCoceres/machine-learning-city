import {
    GraphEditor,
    StopEditor,
    CrossingEditor,
    StartEditor,
    ParkingEditor,
    LightEditor,
    TargetEditor,
    YieldEditor
} from "./js/editors/index.js";
import { Graph } from "./js/math/graph.js";
import { Viewport, World } from "./js/index.js";
import { scale } from "./js/math/utils.js";
import {
    resetBtn,
    saveBtn,
    graphModeBtn,
    stopModeBtn,
    crossingModeBtn,
    startBtn,
    parkingBtn,
    targetBtn,
    yieldBtn,
    lightBtn
} from "./js/elements.js";

const vwCanvas = document.querySelector("#virtualWorldCanvas");

vwCanvas.width = window.innerWidth;
vwCanvas.height = window.innerHeight;

const graphSaved = localStorage.getItem("graph");
const grapshInfo = graphSaved ? JSON.parse(graphSaved) : null
const graph = grapshInfo
    ? Graph.load(grapshInfo)
    : new Graph();
const world = new World(graph);
const viewport = new Viewport(vwCanvas)
const tools = {
    graph: {
        btn: graphModeBtn,
        editor: new GraphEditor(viewport, graph)
    },
    stop: {
        btn: stopModeBtn,
        editor: new StopEditor(viewport, world)
    },
    crossing: {
        btn: crossingModeBtn,
        editor: new CrossingEditor(viewport, world)
    },
    start: {
        btn: startBtn,
        editor: new StartEditor(viewport, world)
    },
    parking: {
        btn: parkingBtn,
        editor: new ParkingEditor(viewport, world)
    },
    target: {
        btn: targetBtn,
        editor: new TargetEditor(viewport, world)
    },
    yield: {
        btn: yieldBtn,
        editor: new YieldEditor(viewport, world)
    },
    light: {
        btn: lightBtn,
        editor: new LightEditor(viewport, world)
    }
}

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
    for (const tool of Object.keys(tools)) {
        tools[tool].editor.display();
    }
    requestAnimationFrame(animate);
}

function setMode(mode) {
    dissableEditors();
    tools[mode].btn.classList.remove("disabled");
    tools[mode].editor.enable();
}

function dissableEditors() {
    for (const tool of Object.keys(tools)) {
        tools[tool].btn.classList.add("disabled");
        tools[tool].editor.disable();
    }
}

resetBtn.addEventListener("click", () => {
    tools['graph'].editor.dispose()
    world.markings.length = 0
})
saveBtn.addEventListener("click", () => {
    tools['graph'].editor.save()
})

for (const tool of Object.keys(tools)) {
    tools[tool].btn.addEventListener("click", () => {
        setMode(tool);
    })
}