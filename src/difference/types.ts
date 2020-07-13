export interface LAB {
    L: number;
    A: number;
    B: number;
}

export interface DeltaEWeights {
    lightness?: number;
    chroma?: number;
    hue?: number;
}

export interface DeltaEFormula<T> {
    (a: T, b: T, weights?: DeltaEWeights): number;
}
