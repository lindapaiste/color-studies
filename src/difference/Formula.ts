import {Algo, DeltaECalculator, FormulaSettings} from "./types";
import {ColorSpaceName} from "../spacesChannels/types";
import {makeDeltaE00, makeDeltaE94} from "./distance";
import {EuclideanCalculator} from "./EuclideanCalculator";

export interface I_Formula  extends FormulaSettings {
    deltaE: DeltaECalculator;
}

/**
 * maps a FormulaSettings object into an object which has method deltaE -- a DeltaECalculator
 */
export class Formula implements FormulaSettings, I_Formula {
    public readonly algo: Algo;
    public readonly model: ColorSpaceName;
    public readonly weights: number[];
    public readonly deltaE: DeltaECalculator;

    constructor({algo, model, weights}: FormulaSettings) {
        this.algo = algo || 'CIE2000';
        this.model = model || 'lch';
        this.weights = weights || [1, 1, 1, 1];

        switch (algo) {
            case "CIE1994":
                this.deltaE = makeDeltaE94(weights);
                break;
            case "CIE2000":
                this.deltaE = makeDeltaE00(weights);
                break;
            case "Euclidean":
                this.deltaE = (new EuclideanCalculator({weights, model})).getDeltaE;
        }
    }
}
