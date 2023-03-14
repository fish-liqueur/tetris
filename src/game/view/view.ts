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

export class View {
    rootElement: HTMLDivElement;
    width: number;
    height: number;
    viewSizeConstants: ViewSizeConstants;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    private blockColors = ['none', Colors.i, Colors.j, Colors.l, Colors.o, Colors.s, Colors.t, Colors.z];

    constructor(rootId: string, gameWidthInBlocks: number) {
        const canvasMaxWidth = 650;
        this.rootElement = document.getElementById(rootId)! as HTMLDivElement;
        const canvasWidth = this.rootElement.offsetWidth < canvasMaxWidth ? this.rootElement.offsetWidth :  canvasMaxWidth;
        this.width = this.height = canvasWidth;
        this.viewSizeConstants = this.getSizeConstants(canvasWidth, gameWidthInBlocks);
        this.canvas = document.createElement('canvas') as HTMLCanvasElement;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.rootElement.appendChild(this.canvas);
    }

    getSizeConstants(width: number, widthInBricks: number): ViewSizeConstants {
        const borders = width / 2 * 0.02
        return {
            width,
            height: width,
            borderWidth: borders,
            blockSide: (width / 2 - borders * 2) / widthInBricks,
        };
    }

    renderGame(state: GameCurrentState) {
        const { board, gameSizeInBlocks, nextPiece, speed, score, lines } = state;
        this.clearView();
        this.renderGameBoard(board, gameSizeInBlocks);
        this.renderInfoBoard(nextPiece, speed, score, lines);
    }

    private clearView() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    private renderGameBoard(board: GameBoardMatrix, gameSizeInBlocks: GameSizeInBlocks) {
        const ctx = this.context;
        const width = this.viewSizeConstants.width / 2;
        const height = this.viewSizeConstants.height - this.viewSizeConstants.borderWidth * 2;
        const { blockSide, borderWidth } = this.viewSizeConstants;

        ctx.globalAlpha = 1;

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

    private renderInfoBoard(nextPiece: Piece, speed: number, score: number, lines: number): void {
        const ctx = this.context;
        const left = this.viewSizeConstants.width / 2 + this.viewSizeConstants.blockSide;
        const yUnit = this.viewSizeConstants.height * 0.05;
        const nextPieceBoard = this.wrapPieceWithEmptyBlocks(nextPiece);
        const boardHeight = nextPieceBoard.length;
        const boardWidth = nextPieceBoard[0].length;

        ctx.globalAlpha = 1;
        ctx.textAlign = 'start';
        ctx.textBaseline = 'top';
        ctx.fillStyle = Colors.uiYellow;
        ctx.font = `normal ${0.8 * yUnit}px VT323`;

        ctx.fillText(`Speed: ${speed}`, left, yUnit);
        ctx.fillText(`Score: ${score}`, left, yUnit * 2);
        ctx.fillText(`Lines: ${lines}`, left, yUnit * 3);
        ctx.fillText('Next piece:', left, yUnit * 4);

        ctx.fillStyle = 'rgba(100, 100, 100, 0.2)';
        ctx.fillRect(
            left,
            yUnit * 5,
            boardWidth * this.viewSizeConstants.blockSide + this.viewSizeConstants.borderWidth,
            boardHeight * this.viewSizeConstants.blockSide + this.viewSizeConstants.borderWidth,
        );

        ctx.lineWidth = this.viewSizeConstants.borderWidth / 2;
        ctx.strokeStyle = Colors.uiPink;
        ctx.strokeRect(
            left - this.viewSizeConstants.borderWidth / 4,
            yUnit * 5 - this.viewSizeConstants.borderWidth / 4,
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
                    topY: yUnit * 5,
                });
            }
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

    private renderBlock(params: RenderBlockParams): void {
        const { block, xInBlocks, yInBlocks, topX, topY } = params;
        const ctx = this.context;
        const { blockSide } = this.viewSizeConstants;

        if (block) {
            ctx.globalAlpha = 1;
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

    private getFigureString(length: number, contents: GameBlock) {
        const string = [];
        for (let i = 0; i < length; i++) {
            string.push(contents);
        }
        return string;
    }
}