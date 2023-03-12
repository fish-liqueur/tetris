import {GameBlock, GameBoardMatrix} from "@/types/types";
import {Piece} from "@game/model/piece";
import { Model } from "@game/model/model"

export class Board {
    width: number;
    height: number;
    matrix: GameBoardMatrix;

    constructor();
    constructor(preConfiguredBoard: GameBoardMatrix);
    constructor(width: number, height: number);
    constructor(param1?: number | GameBoardMatrix, height?:number) {
        if (typeof param1 === 'number' && typeof height === 'number' || !param1) {
            this.width = param1 || 10;
            this.height = height || 20;

            let board: GameBoardMatrix = [];
            for (let rowCount = 0; rowCount < this.height; rowCount++) {
                const row: GameBlock[] = [];
                for (let columnsCount = 0; columnsCount < this.width; columnsCount++) {
                    row.push(0);
                }
                board.push(row);
            }
            this.matrix = board;
        } else if (typeof param1 === 'object' && (param1 as GameBoardMatrix)[0]) {
            this.matrix = param1;
            this.width = this.matrix[0].length;
            this.height = this.matrix.length;
        } else {
            throw new Error('Wrong params!');
        }
    }

    deleteEmptyRows(): number {
        const matrixFiltered = this.matrix.filter((row:GameBlock[]) => !row.includes(0));
        const rowsDeleted = this.matrix.length - matrixFiltered.length;
        this.matrix = matrixFiltered;
        return rowsDeleted;
    }

    addPieceToMatrix(piece: Piece): void {
        this.matrix = Model.mergePieceToBoard(this, piece);
    }
}