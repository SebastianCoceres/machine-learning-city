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
    lightBtn,
    inputFile
} from "./js/elements.js";

const vwCanvas = document.querySelector("#virtualWorldCanvas");

vwCanvas.width = window.innerWidth;
vwCanvas.height = window.innerHeight;

const worldSaved = localStorage.getItem("world");
const worldInfo = worldSaved ? JSON.parse(worldSaved) : null

let world = worldInfo ? World.load(worldInfo) : new World(new Graph());
const graph = world.graph;
const viewport = new Viewport(vwCanvas, world);
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

function save() {

    world.zoom = viewport.zoom;
    world.offset = viewport.offset;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(world)));

    const date = new Date();
    const fileName = `World-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.world`;
    element.setAttribute('download', fileName);

    element.click();

    localStorage.setItem("world", JSON.stringify(world));
}

function load(e) {
    const file = e.target.files[0];
    if (!file) {
        alert("No file selected");
        return
    }

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
        const json = JSON.parse(e.target.result);
        console.log(world)
        world = World.load(json);
        localStorage.setItem("world", JSON.stringify(world));
        location.reload();
    };

}

resetBtn.addEventListener("click", () => {
    tools['graph'].editor.dispose()
    world.markings.length = 0
})
saveBtn.addEventListener("click", () => {
    save()
})

inputFile.addEventListener("change", load)


for (const tool of Object.keys(tools)) {
    tools[tool].btn.addEventListener("click", () => {
        setMode(tool);
    })
}