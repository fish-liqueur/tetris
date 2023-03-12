import { Model } from "@game/model/model";
import { autobind } from "@/decorators/autobind";

export class Controller {
    model: Model;

    constructor(model: Model) {
        this.model = model;

        document.addEventListener('keydown', this.handleKeyDown);
        // document.addEventListener('keyup', this.handleKeyUp.bind(this));

    }

    @autobind
    handleKeyDown(e: KeyboardEvent) {
        console.log('handleKeyDown ', this)

        switch (e.code) {
            case 'Space':
                console.log('Space pressed');
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
}