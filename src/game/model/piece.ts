import { GameBoardMatrix } from "@/types/types";
import {cloneElement} from "@/utils/utils";

export class Piece {
    y = -1;
    x: number;
    type: PieceType;
    figure: GameBoardMatrix;
    fieldWidth: number;

    get width(): number {
        return this.figure[0].length;
    }

    get height(): number {
        return this.figure.length;
    }

    constructor(fieldWidth: number) {
        const index = Math.floor(Math.random() * 7);
        const type = 'ijlostz'[index] as PieceType;
        const figure = {
            i: [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            j: [
                [0, 0, 0],
                [2, 2, 2],
                [0, 0, 2],
            ],
            l: [
                [0, 0, 0],
                [3, 3, 3],
                [3, 0, 0],
            ],
            o: [
                [0, 0, 0, 0],
                [0, 4, 4, 0],
                [0, 4, 4, 0],
                [0, 0, 0, 0],
            ],
            s: [
                [0, 0, 0],
                [0, 5, 5],
                [5, 5, 0],
            ],
            t: [
                [0, 0, 0],
                [6, 6, 6],
                [0, 6, 0],
            ],
            z: [
                [0, 0, 0],
                [7, 7, 0],
                [0, 7, 7],
            ],
        };
        this.fieldWidth = fieldWidth;
        this.figure = figure[type] as GameBoardMatrix;
        this.type = type;
        this.x = Math.floor((fieldWidth - this.figure[0].length) / 2);
    }

    moveLeft(): void {
        this.x--;
    }

    moveRight(): void {
        this.x++;
    }

    moveDown(): void {
        this.y++;
    }

    rotate(cw = true): void {
        const tempFigure = cloneElement(this.figure);

        if (cw) {
            this.figure = tempFigure[0].map((_:any, index: number) => tempFigure.map((row: []) => row[index]).reverse());
        } else {
            this.figure = tempFigure[0].map((_:any, index: number) => tempFigure.map((row: []) => row[row.length - 1 - index]));
        }
    }
}

type PieceType = 'i'|'j'|'l'|'o'|'s'|'t'|'z';