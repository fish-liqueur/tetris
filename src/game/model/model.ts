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
    speedChanged = 0;
    score = 0;
    scoreChanged = 0;
    lines = 0;
    linesChanged = 0;
    interval: NodeJS.Timer | null;

    gameSizeInBlocks: GameSizeInBlocks;
    gameBoardStatic: Board;
    currentPiece: Piece;
    nextPiece: Piece;

    get getState(): GameCurrentState {
        return {
            speed: this.speed,
            speedChanged: this.speedChanged,
            score: this.score,
            scoreChanged: this.scoreChanged,
            lines: this.lines,
            linesChanged: this.linesChanged,
            board: Model.mergePieceToBoard(this.gameBoardStatic, this.currentPiece),
            nextPiece: this.nextPiece,
            started: this.started,
            pause: this.pause,
            lost: this.lost,
            gameSizeInBlocks: this.gameSizeInBlocks,
        };
    }

    constructor(view: View, gameSizeInBlocks: GameSizeInBlocks) {
        this.view = view;
        this.started = false;
        this.pause = true;
        this.interval = null;
        this.gameSizeInBlocks = gameSizeInBlocks;
        this.gameBoardStatic = new Board(this.gameSizeInBlocks.width, this.gameSizeInBlocks.height);
        this.currentPiece = new Piece(this.gameSizeInBlocks.width);
        this.nextPiece = new Piece(this.gameSizeInBlocks.width);

        this.view.renderGame(this.getState);
    }


    startTimer():void {
        const speed = 1000 - this.speed * 100;
        this.pause = false;
        this.view.renderGame(this.getState);

        if (!this.interval) {
            this.interval = setInterval(this.handleNewTurn, speed > 0 ? speed : 100);
        }
    }

    stopTimer():void {
        if (this.interval) {
            this.pause = true;
            clearInterval(this.interval);
            this.interval = null;
        }
        this.view.renderGame(this.getState);
    }

    handlePressSpace():void {
        if (!this.started) {
            this.started = true;
            this.startTimer();
        } else if (this.lost) {
            this.resetGame();
        } else {
            this.interval ? this.stopTimer() : this.startTimer();
        }
    }

    @autobind
    handleNewTurn(userAction?: PieceMoveType):void {
        if (this.pause || this.lost) return;

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
          
          if (userAction === 'down') {
              this.scoreChanged = this.speed + 1;
              this.score += this.scoreChanged;
          }

        } else {
            const movedDownSuccessfully = this.handleIfPossible([[Piece.prototype.moveDown]]);

            if (!movedDownSuccessfully && this.currentPiece.y < 0) {
                // Game is lost!
                this.lost = true;
                this.view.renderGame(this.getState);
                return;
            }

            if (!movedDownSuccessfully) {
                this.gameBoardStatic.addPieceToMatrix(this.currentPiece);
                this.updatePieces();
            }

            const deletedRowsCount = this.gameBoardStatic.deleteFilledRows();
            let speedAtTheEndOfTurn: number;

            this.lines += deletedRowsCount;
            this.linesChanged = deletedRowsCount;
            this.scoreChanged = deletedRowsCount ? Model.getScoreMultiplier(deletedRowsCount) * (this.speed + 1) : 0;
            this.score += this.scoreChanged;

            speedAtTheEndOfTurn = Math.floor(this.lines / 10);
            this.speedChanged = speedAtTheEndOfTurn - this.speed;
            this.speed = speedAtTheEndOfTurn;
            if (this.speedChanged) {
                this.stopTimer();
                this.startTimer();
                return;
            }
        }

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

    private resetGame(): void {
        this.stopTimer();
        this.lost = false;
        this.started = true;
        this.gameBoardStatic = new Board(this.gameSizeInBlocks.width, this.gameSizeInBlocks.height);
        this.currentPiece = new Piece(this.gameSizeInBlocks.width);
        this.nextPiece = new Piece(this.gameSizeInBlocks.width);
        this.speed = 0;
        this.speedChanged = 0;
        this.score = 0;
        this.scoreChanged = 0;
        this.lines = 0;
        this.linesChanged = 0;
        this.startTimer();
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

    private static getScoreMultiplier(deletedLinesCount: number) {
        return [40, 100, 300, 1200][deletedLinesCount - 1] || 1;
    }
}