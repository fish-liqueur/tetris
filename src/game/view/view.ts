import {Colors} from "@/enums/colors";
import {
    GameBlock,
    GameBoardMatrix,
    GameCurrentState,
    GameSizeInBlocks,
    RenderBlockParams,
    ViewSizeConstants
} from "@/types/types"
import {Piece} from "@game/model/piece";
import {getCanvasWidth} from "@/utils/utils";
import {autobind} from "@/decorators/autobind";

export class View {
    rootElement: HTMLDivElement;
    width: number;
    height: number;
    viewSizeConstants: ViewSizeConstants;
    gameWidthInBlocks: number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    opacityFull = 1;
    state: GameCurrentState | null = null;
    private blockColors = ['none', Colors.i, Colors.j, Colors.l, Colors.o, Colors.s, Colors.t, Colors.z];

    constructor(rootId: string, gameWidthInBlocks: number) {
        this.gameWidthInBlocks = gameWidthInBlocks;
        this.rootElement = document.getElementById(rootId)! as HTMLDivElement;
        const canvasWidth = getCanvasWidth();
        this.width = this.height = canvasWidth;
        this.viewSizeConstants = this.getSizeConstants(canvasWidth, this.gameWidthInBlocks);
        this.canvas = document.createElement('canvas') as HTMLCanvasElement;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.rootElement.appendChild(this.canvas);

        window.addEventListener("resize", this.resizeGameboard);
    }

    renderGame(state: GameCurrentState): void {
        this.state = state;
        const { board, gameSizeInBlocks, pause, started, lost } = state;
        const showOverlay = pause || !started || lost;

        this.opacityFull = showOverlay ? 0.5 : 1;

        this.clearView();
        this.renderGameBoard(board, gameSizeInBlocks);
        this.renderInfoBoard(state);

        if (showOverlay) this.renderOverlay(state);
    }

    @autobind
    resizeGameboard(): void {
        if (!this.state) {
            return;
        }

        const canvasWidth = getCanvasWidth();
        this.width = this.height = canvasWidth;
        this.viewSizeConstants = this.getSizeConstants(canvasWidth, this.gameWidthInBlocks);
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.renderGame(this.state);
    }

    private getSizeConstants(width: number, widthInBricks: number): ViewSizeConstants {
        const borders = width / 2 * 0.02
        return {
            width,
            height: width,
            relativeUnit: Math.round(width * 0.05),
            borderWidth: borders,
            blockSide: (width / 2 - borders * 2) / widthInBricks,
        };
    }

    private clearView() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    private renderGameBoard(board: GameBoardMatrix, gameSizeInBlocks: GameSizeInBlocks) {
        const ctx = this.context;
        const width = this.viewSizeConstants.width / 2;
        const height = this.viewSizeConstants.height - this.viewSizeConstants.borderWidth * 2;
        const { blockSide, borderWidth } = this.viewSizeConstants;

        ctx.globalAlpha = this.opacityFull;

        ctx.fillStyle = 'rgba(100, 100, 100, 0.2)';
        ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = this.viewSizeConstants.borderWidth;
        ctx.strokeStyle = Colors.uiPink;
        ctx.strokeRect(
            this.viewSizeConstants.borderWidth / 2,
            this.viewSizeConstants.borderWidth / 2,
            width - this.viewSizeConstants.borderWidth,
            height - this.viewSizeConstants.borderWidth
        );

        for (let rowNumber = 0; rowNumber < gameSizeInBlocks.height; rowNumber++) {
            for (let blockNumber = 0; blockNumber < gameSizeInBlocks.width; blockNumber++) {
                this.renderBlock({
                    block: board[rowNumber][blockNumber],
                    xInBlocks: blockNumber,
                    yInBlocks: rowNumber,
                    topX: blockSide * 0.05 + borderWidth,
                    topY: blockSide * 0.05 + borderWidth,
                });
            }
        }
    }

    private renderInfoBoard(state: GameCurrentState): void {
        const { speed, speedChanged, score, scoreChanged, lines, linesChanged, nextPiece } = state;
        const ctx = this.context;
        const left = this.viewSizeConstants.width / 2 + this.viewSizeConstants.blockSide;
        const { relativeUnit } = this.viewSizeConstants;
        const nextPieceBoard = this.wrapPieceWithEmptyBlocks(nextPiece);
        const boardHeight = nextPieceBoard.length;
        const boardWidth = nextPieceBoard[0].length;

        ctx.globalAlpha = this.opacityFull;
        ctx.textAlign = 'start';
        ctx.textBaseline = 'top';
        ctx.fillStyle = Colors.uiYellow;
        ctx.font = `normal ${0.8 * relativeUnit}px VT323`;

        ctx.fillText(`Speed: ${speed}`, left, relativeUnit);
        if (speedChanged) {
            ctx.fillStyle = Colors.uiPink;
            ctx.fillText(`+${speedChanged}`, left + 2.5 * relativeUnit + speed.toString().length * 0.3 * relativeUnit, relativeUnit);
            ctx.fillStyle = Colors.uiYellow;
        }
        ctx.fillText(`Score: ${score}`, left, relativeUnit * 2);
        if (scoreChanged) {
            ctx.fillStyle = Colors.uiPink;
            ctx.fillText(`+${scoreChanged}`, left + 2.5 * relativeUnit + score.toString().length * 0.3 * relativeUnit, relativeUnit * 2);
            ctx.fillStyle = Colors.uiYellow;
        }
        ctx.fillText(`Lines: ${lines}`, left, relativeUnit * 3);
        if (linesChanged) {
            ctx.fillStyle = Colors.uiPink;
            ctx.fillText(`+${linesChanged}`, left + 2.5 * relativeUnit + lines.toString().length * 0.3 * relativeUnit, relativeUnit * 3);
            ctx.fillStyle = Colors.uiYellow;
        }
        ctx.fillText('Next piece:', left, relativeUnit * 4);

        ctx.fillStyle = 'rgba(100, 100, 100, 0.2)';
        ctx.fillRect(
            left,
            relativeUnit * 5,
            boardWidth * this.viewSizeConstants.blockSide + this.viewSizeConstants.borderWidth,
            boardHeight * this.viewSizeConstants.blockSide + this.viewSizeConstants.borderWidth,
        );

        ctx.lineWidth = this.viewSizeConstants.borderWidth / 2;
        ctx.strokeStyle = Colors.uiPink;
        ctx.strokeRect(
            left - this.viewSizeConstants.borderWidth / 4,
            relativeUnit * 5 - this.viewSizeConstants.borderWidth / 4,
            boardWidth * this.viewSizeConstants.blockSide + this.viewSizeConstants.borderWidth / 2,
            boardHeight * this.viewSizeConstants.blockSide + this.viewSizeConstants.borderWidth / 2,
        );

        for (let rowNumber = 0; rowNumber < boardHeight; rowNumber++) {
            for (let blockNumber = 0; blockNumber < boardWidth; blockNumber++) {
                this.renderBlock({
                    block: nextPieceBoard[rowNumber][blockNumber],
                    xInBlocks: blockNumber,
                    yInBlocks: rowNumber,
                    topX: left,
                    topY: relativeUnit * 5,
                });
            }
        }
    }

    private renderBlock(params: RenderBlockParams): void {
        const { block, xInBlocks, yInBlocks, topX, topY } = params;
        const ctx = this.context;
        const { blockSide } = this.viewSizeConstants;

        if (block) {
            ctx.globalAlpha = this.opacityFull;
            ctx.fillStyle = this.blockColors[block];
            ctx.fillRect(
                topX + blockSide * xInBlocks,
                topY + blockSide * yInBlocks,
                blockSide * 0.9,
                blockSide * 0.9
            );
        } else {
            ctx.globalAlpha = 0.2;
            ctx.lineWidth = 1;
            ctx.strokeStyle = Colors.empty;
            ctx.strokeRect(
                topX + blockSide * xInBlocks,
                topY + blockSide * yInBlocks,
                blockSide * 0.9,
                blockSide * 0.9
            );
        }
    }

    private renderOverlay(state: GameCurrentState): void {
        const { speed, score, lines, started, lost } = state;
        const { relativeUnit, width, blockSide } = this.viewSizeConstants;
        const ctx = this.context;
        const textX = width / 2 + blockSide;
        ctx.globalAlpha = 1;
        ctx.font = `${0.8 * relativeUnit}px VT323`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = Colors.uiYellow;

        if (!started) {
            ctx.fillText('Press Space / Play',  textX, width / 2 + relativeUnit);
            ctx.fillText('to start the game!',  textX, width / 2 + 2 * relativeUnit);
            ctx.fillText('Or tap the screen to',  textX, width / 2 + 4 * relativeUnit);
            ctx.fillText('enable touch buttons',  textX, width / 2 + 5 * relativeUnit);
        } else if (lost) {
            ctx.fillText('What a game!',  textX, width / 2 + relativeUnit);
            ctx.fillStyle = Colors.uiPink;
            ctx.fillText('And by the numbers:',  textX, width / 2 + 3 * relativeUnit);
            ctx.fillText(`🏆 score: ${score}`,  textX, width / 2 + 4 * relativeUnit);
            ctx.fillText(`🧨 lines destroyed: ${lines}`,  textX, width / 2 + 5 * relativeUnit);
            ctx.fillText(`🔥 highest speed: ${speed}`,  textX, width / 2 + 6 * relativeUnit);
            ctx.fillStyle = Colors.uiYellow;
            ctx.fillText('Press Space / Play to restart',  textX, width / 2 + 8 * relativeUnit);
        } else {
            ctx.fillText('Game paused',  textX, width / 2 + relativeUnit);
            ctx.fillText('Press Space / Play to resume',  textX, width / 2 + 2 * relativeUnit);
        }
    }

    private wrapPieceWithEmptyBlocks(piece: Piece):GameBoardMatrix {
        const { figure } = piece;
        const { addLeft, addRight, addTop, addBottom, removeBottom } = figure.reduce(
            (
                result: {
                addLeft: boolean,
                addRight: boolean,
                addTop: boolean,
                addBottom: boolean,
                removeBottom: boolean,
            },
                row: GameBlock[],
                rowIndex: number
            ) => {
                if (rowIndex === 0) {
                    result.addTop = row.some((block: GameBlock) => block !== 0);
                }

                if (row[0]) {
                    result.addLeft = true;
                }

                if (row[row.length - 1]) {
                    result.addRight = true;
                }

                if (rowIndex === piece.height - 1) {
                    const lastRowContains = row.some((block: GameBlock) => block !== 0);
                    const penultimateRowContains = figure[piece.height - 2]?.some((block: GameBlock) => block !== 0);
                    if (lastRowContains) {
                        result.addBottom = true;
                    } else if (!penultimateRowContains) {
                        result.removeBottom = true;
                    }

                }
                return result;
            }, { addLeft: false, addRight: false, addTop: false, addBottom: false, removeBottom: false });
        const needToIterateRows = addLeft || addRight;
        const needToAddRows = addTop || addBottom;
        if (needToIterateRows) {
            for (const row of figure) {
                if (addLeft) {
                    row.unshift(0);
                }
                if (addRight) {
                    row.push(0);
                }
            }
        }

        if (needToAddRows) {
            const gameBlock = 0 as GameBlock;
            const newString = this.getFigureString(figure[0].length, gameBlock) as GameBlock[];
            if (addTop) {
                figure.unshift(newString);
            }
            if (addBottom) {
                figure.push(newString);
            }
        }

        if (removeBottom) {
            figure.splice(piece.height - 1, 1);
        }

        return figure;
    }

    private getFigureString(length: number, contents: GameBlock) {
        const string = [];
        for (let i = 0; i < length; i++) {
            string.push(contents);
        }
        return string;
    }
}