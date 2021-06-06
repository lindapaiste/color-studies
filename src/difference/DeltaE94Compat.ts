import { I_DeltaECalculator, KeyedLCHWeights } from "./types";
import { toKeyedLAB, toKeyedWeights } from "./distance";
import { ifDefined } from "../lib";
import DeltaE1994 from "./DeltaE1994";
import { I_ColorAdapter } from "../color/types";

export class DeltaE94Compat implements I_DeltaECalculator {
  private readonly weights: Partial<KeyedLCHWeights>;

  constructor({ weights }: { weights?: number[] }) {
    this.weights = ifDefined(toKeyedWeights(weights), {});
  }

  getDeltaE(a: I_ColorAdapter, b: I_ColorAdapter): number {
    const converter = new DeltaE1994(
      toKeyedLAB(a.to("lab")),
      toKeyedLAB(b.to("lab")),
      this.weights
    );
    return converter.getDeltaE();
  }
}
