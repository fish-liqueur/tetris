import { Piece } from "@game/model/piece";
import { Board } from "@game/model/board";
import { View } from "@game/view/view";
import { cloneElement, cloneInstance } from "@/utils/utils";
import {
    GameBoardMatrix,
    GameSizeInBlocks,
    GameCurrentState,
    PieceMoveType
} from "@/types/types";
import { autobind } from "@/decorators/autobind";

export class Model {
    view: View;
    started: boolean;
    pause: boolean;
    lost = false;
    speed = 0;
    score = 0;
    lines = 0;
    interval: NodeJS.Timer | null;

    gameSizeInBlocks: GameSizeInBlocks;
    gameBoardStatic: Board;
    currentPiece: Piece;
    nextPiece: Piece;

    get getState(): GameCurrentState {
        return {
            speed: this.speed,
            score: this.score,
            lines: this.lines,
            board: Model.mergePieceToBoard(this.gameBoardStatic, this.currentPiece),
            nextPiece: this.nextPiece,
            started: this.started,
            pause: this.pause,
            gameSizeInBlocks: this.gameSizeInBlocks,
        };
    }

    constructor(view: View, gameSizeInBlocks: GameSizeInBlocks) {
        this.view = view;
        this.started = true;
        this.pause = false;
        this.interval = null;
        this.gameSizeInBlocks = gameSizeInBlocks;
        this.gameBoardStatic = new Board(this.gameSizeInBlocks.width, this.gameSizeInBlocks.height);
        this.currentPiece = new Piece(this.gameSizeInBlocks.width);
        this.nextPiece = new Piece(this.gameSizeInBlocks.width);

        this.view.renderGame(this.getState);
        this.startTimer();
    }

    @autobind
    handleNewTurn(userAction?: PieceMoveType):void {
        if (this.pause) return;

        if (userAction) {
            let userActionSuccess: boolean;
            switch(userAction) {
                case 'left':
                    userActionSuccess = this.handleIfPossible([[Piece.prototype.moveLeft]]);
                    break;
                case 'right':
                    userActionSuccess = this.handleIfPossible([[Piece.prototype.moveRight]]);
                    break;
                case 'down':
                    userActionSuccess = this.handleIfPossible([[Piece.prototype.moveDown]]);
                    break;
                case 'rotate':
                    userActionSuccess = this.rotateCurrentPiece();
                    break;
                default:
                    userActionSuccess = false;
            }

          if (!userActionSuccess) return;

        } else {
            const movedDownSuccessfully = this.handleIfPossible([[Piece.prototype.moveDown]]);

            if (!movedDownSuccessfully) {
                this.gameBoardStatic.addPieceToMatrix(this.currentPiece);
                this.updatePieces();
            }
        }

        const deletedRowsCount = this.gameBoardStatic.deleteFilledRows();
        this.lines += deletedRowsCount;
        this.speed = Math.floor(this.lines / 10);

        this.view.renderGame(this.getState);
    }

    private rotateCurrentPiece(): boolean {
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
       return this.handleIfPossible(methodChains);
    }

    private handleIfPossible(methodChains: Function[][]): boolean {
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
                return true;
            }
        }
        return false;
    }

    private updatePieces(): void {
        this.currentPiece = this.nextPiece;
        this.nextPiece = new Piece(this.gameSizeInBlocks.width);
    }

    startTimer() {
        const speed = 1000 - this.speed * 100;

        if (!this.interval) {
            this.interval = setInterval(this.handleNewTurn, speed > 0 ? speed : 100);
        }
    }

    stopTimer() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    static mergePieceToBoard(board: Board, piece: Piece): GameBoardMatrix {
        const { figure, y, x } = piece;
        const height = piece.height;
        const width = piece.width;
        const matrixCopy = cloneElement(board.matrix);
        for (let rowNumber = 0; rowNumber < height; rowNumber++) {
            for (let blockNumber = 0; blockNumber < width; blockNumber++) {
                const nextBlockFigure = figure[rowNumber][blockNumber];
                if (nextBlockFigure !== 0) {
                    matrixCopy[rowNumber + y][blockNumber + x] = nextBlockFigure;
                }
            }
        }
        return matrixCopy;
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