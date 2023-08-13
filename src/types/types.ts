import { Piece } from "@game/model/piece";

export type GameBlock = 0|1|2|3|4|5|6|7;

export type GameBoardMatrix = GameBlock[][];

export type GameSizeInBlocks = {
    height: number,
    width: number,
};

export type GameCurrentState = {
    speed: number,
    speedChanged: number,
    score: number,
    scoreChanged: number,
    lines: number,
    linesChanged: number,
    board: GameBoardMatrix,
    nextPiece: Piece,
    started: boolean,
    pause: boolean,
    lost: boolean,
    gameSizeInBlocks: GameSizeInBlocks,
}

export type ViewSizeConstants = {
    width: number,
    height: number,
    blockSide: number,
    borderWidth: number,
    relativeUnit: number,
}

export type RenderBlockParams = {
    block: GameBlock,
    xInBlocks: number,
    yInBlocks: number,
    topX: number,
    topY: number,
}

export type PieceMoveType = 'left'|'right'|'down'|'rotate';

export type PossibleControlCommandKeys = PieceMoveType|'play-pause';