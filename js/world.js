import {
    Envelope, Polygon,
    Segment,
    Point
} from "./primitives/index.js";
import { Building, Tree } from "./items/index.js";
import { Light } from "./markings/index.js";
import { log } from "./utils/logger.js";
import { add, scale, lerp, distance, getNearestPoint } from "./math/utils.js";

export class World {
    constructor(
        graph,
        roadWidth = 100,
        roadRoundness = 10,
        buildingWidth = 200,
        buildingMinLength = 100,
        spacing = 50,
        treeSize = 160
    ) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;
        this.buildingWidth = buildingWidth;
        this.buildingMinLength = buildingMinLength;
        this.spacing = spacing;
        this.treeSize = treeSize;

        this.envelopes = [];
        this.roadBorders = [];
        this.buildings = [];
        this.trees = [];
        this.laneGuides = [];
        this.markings = [];

        this.frameCount = 0;

        this.generate();
    }
    generate() {
        this.envelopes.length = 0;
        for (const segment of this.graph.segments) {
            this.envelopes.push(
                new Envelope(segment, this.roadWidth, this.roadRoundness)
            );
        }
        if (this.envelopes.length > 1) {
            this.roadBorders = Polygon.union(this.envelopes.map(e => e.poly));
            this.buildings = this.#generateBuildings();
            this.trees = this.#generateTrees();

            this.laneGuides.length = 0;
            this.laneGuides.push(...this.#generateLaneGuides());
        } else {
            log({ msg: "No segments found" }, "error")
        }
    }

    #generateBuildings() {
        const tmpEnvelopes = [];
        for (const seg of this.graph.segments) {
            tmpEnvelopes.push(
                new Envelope(seg, this.roadWidth + this.buildingWidth + this.spacing * 2, this.roadRoundness)
            )
        }

        const guides = Polygon.union(tmpEnvelopes.map(e => e.poly));
        for (let i = 0; i < guides.length; i++) {
            const seg = guides[i];
            if (seg.length() < this.buildingMinLength) {
                guides.splice(i, 1);
                i--;
            }
        }

        const supports = []
        for (let seg of guides) {
            const len = seg.length() + this.spacing;
            const buildingCount = Math.floor(len / (this.buildingWidth + this.spacing));
            const buildingLength = len / buildingCount - this.spacing;

            const dir = seg.directionVector();
            let q1 = seg.p1;
            let q2 = add(q1, scale(dir, buildingLength))
            supports.push(new Segment(q1, q2));

            for (let i = 2; i <= buildingCount; i++) {
                q1 = add(q2, scale(dir, this.spacing));
                q2 = add(q1, scale(dir, buildingLength));

                supports.push(new Segment(q1, q2));
            }
        }

        const bases = [];
        for (const seg of supports) {
            bases.push(new Envelope(seg, this.buildingWidth).poly)
        }

        const eps = 0.001;
        for (let i = 0; i < bases.length - 1; i++) {
            for (let j = i + 1; j < bases.length; j++) {
                if (
                    bases[i].intersects(bases[j]) ||
                    bases[i].distanceToPoly(bases[j]) < this.spacing - eps
                ) {
                    bases.splice(j, 1);
                    j--;
                }
            }
        }

        return bases.map(b => new Building(b))
    }

    #generateTrees() {
        const points = [
            ...this.roadBorders.map(s => [s.p1, s.p2]).flat(),
            ...this.buildings.map(b => b.base.points).flat()
        ];
        const left = Math.min(...points.map(p => p.x));
        const right = Math.max(...points.map(p => p.x));
        const bottom = Math.min(...points.map(p => p.y));
        const top = Math.max(...points.map(p => p.y));

        const illegalPolygons = [
            ...this.buildings.map(b => b.base),
            ...this.envelopes.map(e => e.poly),
        ]

        const trees = [];
        let tryCount = 0;
        while (tryCount < 100) {
            const p = new Point(
                lerp(left, right, Math.random()),
                lerp(bottom, top, Math.random())
            )
            //check if tre is inside or nearby builind road
            let keep = true;
            for (const poly of illegalPolygons) {
                if (poly.containsPoint(p) || poly.distanceToPoint(p) < this.treeSize) {
                    keep = false;
                    break;
                }
            }

            //check if tree is too close to any other tree
            if (keep) {
                for (const tree of trees) {
                    if (distance(tree.center, p) < this.treeSize) {
                        keep = false;
                        break;
                    }
                }
            }

            // avoid tree being too far away
            if (keep) {
                let closeToSomething = false;
                for (const poly of illegalPolygons) {
                    if (poly.distanceToPoint(p) < this.treeSize * 2) {
                        closeToSomething = true;
                        break;
                    }
                }
                keep = closeToSomething
            }

            if (keep) {
                trees.push(new Tree(p, this.treeSize));
                tryCount = 0;
            };

            tryCount++;
        }

        return trees
    }

    #generateLaneGuides() {
        const tmpEnvelopes = [];
        for (const seg of this.graph.segments) {
            tmpEnvelopes.push(
                new Envelope(seg, this.roadWidth / 2, this.roadRoundness)
            )
        }

        const segments = Polygon.union(tmpEnvelopes.map(e => e.poly));
        return segments
    }

    #getIntersections() {
        const subset = [];
        for (const point of this.graph.points) {
            let degree = 0;
            for (const seg of this.graph.segments) {
                if (seg.includes(point)) {
                    degree++;
                }
            }

            if (degree > 2) {
                subset.push(point);
            }
        }
        return subset;
    }

    #updateLights() {
        const lights = this.markings.filter((m) => m instanceof Light);
        const controlCenters = [];
        for (const light of lights) {
            const point = getNearestPoint(light.center, this.#getIntersections());
            let controlCenter = controlCenters.find((c) => c.equals(point));
            if (!controlCenter) {
                controlCenter = new Point(point.x, point.y);
                controlCenter.lights = [light];
                controlCenters.push(controlCenter);
            } else {
                controlCenter.lights.push(light);
            }
        }
        const greenDuration = 2,
            yellowDuration = 1;
        for (const center of controlCenters) {
            center.ticks = center.lights.length * (greenDuration + yellowDuration);
        }
        const tick = Math.floor(this.frameCount / 60);
        for (const center of controlCenters) {
            const cTick = tick % center.ticks;
            const greenYellowIndex = Math.floor(
                cTick / (greenDuration + yellowDuration)
            );
            const greenYellowState =
                cTick % (greenDuration + yellowDuration) < greenDuration
                    ? "green"
                    : "yellow";
            for (let i = 0; i < center.lights.length; i++) {
                if (i == greenYellowIndex) {
                    center.lights[i].state = greenYellowState;
                } else {
                    center.lights[i].state = "red";
                }
            }
        }
        this.frameCount++;
    }


    draw(ctx, viewpoint) {
        if (this.graph.segments.length > 0) {

            this.#updateLights();

            for (const envelope of this.envelopes) {
                envelope.draw(ctx, { fill: "#bbb", stroke: "#bbb", lineWidth: 0.5 });
            }

            for (const marking of this.markings) {
                marking.draw(ctx, { color: "white", width: 4 });
            }

            for (const seg of this.graph.segments) {
                seg.draw(ctx, { color: "white", width: 4, dash: [10, 10] });
            }

            for (const seg of this.roadBorders) {
                seg.draw(ctx, { color: "white", width: 4 });
            }

            const items = [...this.buildings, ...this.trees]
            items.sort((a, b) => {
                return b.base.distanceToPoint(viewpoint) - a.base.distanceToPoint(viewpoint)
            })
            for (const item of items) {
                item.draw(ctx, viewpoint);
            }
        } else {
            this.buildings.length = 0;
            this.roadBorders.length = 0;
            this.trees.length = 0;
            this.envelopes.length = 0;
            this.markings.length = 0;
        }

    }
}
