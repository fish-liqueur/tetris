import { Model } from "@game/model/model";
import {autobind} from "@/decorators/autobind";
import { PossibleControlCommandKeys } from "@/types/types"

export class Controller {
    model: Model;

    constructor(model: Model) {
        this.model = model;

        document.addEventListener('keydown', this.handleKeyDown);
    }

    @autobind
    handleKeyDown(e: KeyboardEvent) {
        switch (e.code) {
            case 'Space':
                this.model.handlePressSpace();
                break;
            case 'ArrowLeft':
                this.model.handleNewTurn('left');
                break;
            case 'ArrowUp':
                this.model.handleNewTurn('rotate');
                break;
            case 'ArrowRight':
                this.model.handleNewTurn('right');
                break;
            case 'ArrowDown':
                this.model.handleNewTurn('down');
                break;
        }
    }

    handleExternalButton(key: PossibleControlCommandKeys): void {
        switch (key) {
            case 'play-pause':
                this.model.handlePressSpace();
                break;
            case 'left':
                this.model.handleNewTurn('left');
                break;
            case 'rotate':
                this.model.handleNewTurn('rotate');
                break;
            case 'right':
                this.model.handleNewTurn('right');
                break;
            case 'down':
                this.model.handleNewTurn('down');
                break;
        }
    }
}