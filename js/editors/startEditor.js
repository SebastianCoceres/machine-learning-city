import { Start } from "../markings/index";
import { MarkingEditor } from "./markingEditor";

export class StartEditor extends MarkingEditor {
    constructor(viewport, world) {
        super(viewport, world, world.laneGuides);
    }


    createMarking(center, directionVector) {
        return new Start(center, directionVector, this.world.roadWidth / 2, this.world.roadWidth / 2);
    }

}