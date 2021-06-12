import { DeltaECalculator, KeyedLCHWeights } from "./types";
import { toKeyedLAB, toKeyedWeights } from "./distance";
import DeltaE2000 from "./DeltaE2000";
import { ColorAdapter } from "../convert";

export class DeltaE00Compat implements DeltaECalculator {
  private readonly weights: Partial<KeyedLCHWeights>;

  constructor({ weights }: { weights?: number[] }) {
    this.weights = toKeyedWeights(weights) ?? {};
  }

  getDeltaE(a: ColorAdapter, b: ColorAdapter): number {
    const converter = new DeltaE2000(
      toKeyedLAB(a),
      toKeyedLAB(b),
      this.weights
    );
    return converter.getDeltaE();
  }
}
