import { Game } from "@game/game";
import CanvasGamepad from 'canvas-gamepad';

new Game();

new CanvasGamepad('controls', onTouchButton);

function onTouchButton(buttonKey: string): void {
    console.log('onTouchButton ', buttonKey);
}