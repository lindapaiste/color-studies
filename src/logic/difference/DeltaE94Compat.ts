import { DeltaECalculator, KeyedLCHWeights } from "./types";
import { toKeyedLAB, toKeyedWeights } from "./distance";
import DeltaE1994 from "./DeltaE1994";
import { IColorAdapter } from "../color/types";

export class DeltaE94Compat implements DeltaECalculator {
  private readonly weights: Partial<KeyedLCHWeights>;

  constructor({ weights }: { weights?: number[] }) {
    this.weights = toKeyedWeights(weights) ?? {};
  }

  getDeltaE(a: IColorAdapter, b: IColorAdapter): number {
    const converter = new DeltaE1994(
      toKeyedLAB(a.to("lab")),
      toKeyedLAB(b.to("lab")),
      this.weights
    );
    return converter.getDeltaE();
  }
}
