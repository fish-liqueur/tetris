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
                console.log('ArrowLeft pressed');
                this.model.moveCurrentPiece('left');
                break;
            case 'ArrowUp':
                this.model.rotateCurrentPiece();
                console.log('ArrowUp pressed');
                break;
            case 'ArrowRight':
                console.log('ArrowRight pressed');
                this.model.moveCurrentPiece('right');
                break;
            case 'ArrowDown':
                console.log('ArrowDown pressed');
                this.model.moveCurrentPiece('down');
                break;
        }
    }
}