import { Game } from "@game/game";
import { CanvasGamepad } from 'canvas-gamepad';
import { PossibleControlCommandKeys } from "@/types/types";

const game = new Game();

document.addEventListener('touchend', activateTouchMode);

function onTouchButton(buttonKey: string): void {
    game.clickButton(buttonKey as PossibleControlCommandKeys);
}

function activateTouchMode(): void {
    document.removeEventListener('touchend', activateTouchMode);
    
    const tetrisDiv = document.getElementById('tetris');
    if (!tetrisDiv) return;

    tetrisDiv.classList.add('tetris_touch');
    new CanvasGamepad('controls', onTouchButton);
}
