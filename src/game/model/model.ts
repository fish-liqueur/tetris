import { Piece } from "@game/model/piece";
import { Board } from "@game/model/board";
import { View } from "@game/view/view";
import { cloneElement, cloneInstance} from "@/utils/utils";
import {
    GameBoardMatrix,
    GameSizeInBlocks,
    GameCurrentState,
    PieceMoveDirection
} from "@/types/types";

export class Model {
    view: View;
    started: boolean;
    pause: boolean;
    speed = 0;
    score = 0;
    lines = 0;

    gameSizeInBlocks: GameSizeInBlocks;
    gameBoardStatic: Board;
    currentPiece: Piece;
    nextPiece: Piece;

    get getState(): GameCurrentState {
        return {
            speed: this.speed,
            score: this.score,
            lines: this.lines,
            board: this.getBoard,
            nextPiece: this.nextPiece,
            started: this.started,
            pause: this.pause,
            gameSizeInBlocks: this.gameSizeInBlocks,
        };
    }

    get getBoard(): GameBoardMatrix {
        const { figure, y, x } = this.currentPiece;
        const height = this.currentPiece.height;
        const width = this.currentPiece.width;
        const boardStatic = cloneElement(this.gameBoardStatic.matrix);
        for (let rowNumber = 0; rowNumber < height; rowNumber++) {
            for (let blockNumber = 0; blockNumber < width; blockNumber++) {
                const nextBlockFigure = figure[rowNumber][blockNumber];
                if (nextBlockFigure !== 0) {
                    boardStatic[rowNumber + y][blockNumber + x] = nextBlockFigure;
                }
            }
        }
        return boardStatic;
    }

    constructor(view: View, gameSizeInBlocks: GameSizeInBlocks) {
        this.view = view;
        this.started = true;
        this.pause = false;
        this.gameSizeInBlocks = gameSizeInBlocks;
        this.gameBoardStatic = new Board(this.gameSizeInBlocks.width, this.gameSizeInBlocks.height);
        this.currentPiece = new Piece(this.gameSizeInBlocks.width);
        this.nextPiece = new Piece(this.gameSizeInBlocks.width);

        this.view.renderGame(this.getState);
    }

    moveCurrentPiece(direction: PieceMoveDirection): void {
        const method = direction === 'left' ?
            Piece.prototype.moveLeft :
            direction === 'right' ? Piece.prototype.moveRight : Piece.prototype.moveDown;
        this.handleIfPossible([[method]]);
    }

    rotateCurrentPiece(): void {
        const methodChains = this.currentPiece.x < 0 ?
            [
                [Piece.prototype.rotate],
                [Piece.prototype.moveRight, Piece.prototype.rotate],
                [Piece.prototype.moveRight, Piece.prototype.moveRight, Piece.prototype.rotate]
            ] :
            this.currentPiece.x + this.currentPiece.width > this.gameBoardStatic.width?
                [
                    [Piece.prototype.rotate],
                    [Piece.prototype.moveLeft, Piece.prototype.rotate],
                    [Piece.prototype.moveLeft, Piece.prototype.moveLeft, Piece.prototype.rotate]
                ] :
                [[Piece.prototype.rotate]];
        this.handleIfPossible(methodChains);
    }

    private handleIfPossible(methodChains: Function[][]): void {
        for (let i = 0; i < methodChains.length; i++) {
            const gameBoardStaticProxy = cloneInstance(this.gameBoardStatic);
            const currentPieceProxy = cloneInstance(this.currentPiece);
            methodChains[i].forEach((method: Function) => {
                method.call(currentPieceProxy);
            });
            if (!Model.hasCollision(gameBoardStaticProxy, currentPieceProxy)) {
                methodChains[i].forEach((method: Function) => {
                    method.call(this.currentPiece);
                });
                this.view.renderGame(this.getState);
                return;
            }
        }

    }

    private static hasCollision(staticBoard: Board, currentPiece: Piece): boolean {
        const { figure, y, x } = currentPiece;

        for (let row = 0; row < currentPiece.height; row++) {
            for (let block = 0; block < currentPiece.width; block++) {
                if (
                    figure[row][block] && (
                        !staticBoard.matrix[row + y] ||
                        staticBoard.matrix[row + y][block + x] === undefined ||
                        staticBoard.matrix[row + y][block + x]
                    )
                ) {
                    return true;
                }
            }
        }

        return false;
    }
}