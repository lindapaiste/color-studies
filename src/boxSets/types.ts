import {I_ColorAdapter} from "../color/types";

export interface Levers {
    minDistance: number;
    maxDistance: number;
    minDistinctness: number;
    maxDistinctness: number;
}

export interface Evaluation<T = I_ColorAdapter> {
    color: T;
    match: T;
    distance: number;
    distinctness: number;
    distances: number[];
}

export interface GetDistance<T> {
    (a: T, b: T): number;
}

export interface ChannelShiftSettings {
    channel: string;
    channelMax: number;
    shift: number;
    colorCount: number;
}


export interface BoxData<T = I_ColorAdapter> {
    color: T; //the box color
    matches: Evaluation<T>[]; //the balls
    rejected?: Rejection<T>[]; //rejected balls
}

export interface Rejection<T = I_ColorAdapter> extends Evaluation<T> {
    error: MatchError;
}

export interface MatchError {
    code: ErrorCode;
    message: string;
}

export enum ErrorCode {
    WRONG_MATCH,
    DISTANCE_TOO_LARGE,
    DISTANCE_TOO_SMALL,
    DISTINCTNESS_TOO_LARGE,
    DISTINCTNESS_TOO_SMALL,
}
