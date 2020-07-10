export interface Levers {
    minDistance: number;
    maxDistance: number;
    minDistinctness: number;
    maxDistinctness: number;
}

export interface Evaluation<T> {
    color: T;
    match: T;
    distance: number;
    distinctness: number;
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
