import { DeltaECalculator, KeyedLCHWeights } from "./types";
import { toKeyedLAB, toKeyedWeights } from "./distance";
import DeltaE1994 from "./DeltaE1994";
import { ColorAdapter } from "../convert";

export class DeltaE94Compat implements DeltaECalculator {
  private readonly weights: Partial<KeyedLCHWeights>;

  constructor({ weights }: { weights?: number[] }) {
    this.weights = toKeyedWeights(weights) ?? {};
  }

  getDeltaE(a: ColorAdapter, b: ColorAdapter): number {
    const converter = new DeltaE1994(
      toKeyedLAB(a),
      toKeyedLAB(b),
      this.weights
    );
    return converter.getDeltaE();
  }
}
