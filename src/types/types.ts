import { Piece } from "@game/model/piece";

export type GameBlock = 0|1|2|3|4|5|6|7;

export type GameBoardMatrix = GameBlock[][];

export type GameSizeInBlocks = {
    height: number,
    width: number,
};

export type GameCurrentState = {
    speed: number,
    score: number,
    lines: number,
    board: GameBoardMatrix,
    nextPiece: Piece,
    started: boolean,
    pause: boolean,
    gameSizeInBlocks: GameSizeInBlocks,
}

export type ViewSizeConstants = {
    width: number,
    height: number,
    blockSide: number,
    borderWidth: number,
}

export type RenderBlockParams = {
    block: GameBlock,
    xInBlocks: number,
    yInBlocks: number,
    topX: number,
    topY: number,
}

export type PieceMoveDirection = 'left'|'right'|'down';