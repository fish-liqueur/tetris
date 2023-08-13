import { View } from "@game/view/view";
import { Controller } from "@game/controller/controller";
import { Model } from "@game/model/model";
import { PossibleControlCommandKeys } from "@/types/types"

export class Game {
    model: Model;
    view: View;
    controller: Controller;
    width = 10;
    height = 20;

    constructor() {
        const { height, width } = this;
        this.view = new View('game', width);
        this.model = new Model(this.view, { height, width });
        this.controller = new Controller(this.model);
    }

    public clickButton(key: PossibleControlCommandKeys) {
        this.controller.handleExternalButton(key);
    }
}