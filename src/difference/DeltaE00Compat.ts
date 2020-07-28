import {I_DeltaECalculator, KeyedLCHWeights} from "./types";
import {toKeyedLAB, toKeyedWeights} from "./distance";
import {ifDefined} from "../lib";
import DeltaE2000 from "./DeltaE2000";
import {I_ColorAdapter} from "../color/types";

export class DeltaE00Compat implements I_DeltaECalculator {
    private readonly weights: Partial<KeyedLCHWeights>;

    constructor({weights}: { weights?: number[] }) {
        this.weights = ifDefined(toKeyedWeights(weights), {});
    }

    getDeltaE(a: I_ColorAdapter, b: I_ColorAdapter): number {
        const converter = new DeltaE2000(toKeyedLAB(a.to('lab')), toKeyedLAB(b.to('lab')), this.weights);
        return converter.getDeltaE();
    }
}
