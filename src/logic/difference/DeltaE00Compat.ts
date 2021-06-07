import { DeltaECalculator, KeyedLCHWeights } from "./types";
import { toKeyedLAB, toKeyedWeights } from "./distance";
import DeltaE2000 from "./DeltaE2000";
import { IColorAdapter } from "../color/types";

export class DeltaE00Compat implements DeltaECalculator {
  private readonly weights: Partial<KeyedLCHWeights>;

  constructor({ weights }: { weights?: number[] }) {
    this.weights = toKeyedWeights(weights) ?? {};
  }

  getDeltaE(a: IColorAdapter, b: IColorAdapter): number {
    const converter = new DeltaE2000(
      toKeyedLAB(a.to("lab")),
      toKeyedLAB(b.to("lab")),
      this.weights
    );
    return converter.getDeltaE();
  }
}
