import { Algo, DeltaECalculator, FormulaSettings } from "./types";
import { EuclideanCalculator } from "./EuclideanCalculator";
import { DeltaE00Compat } from "./DeltaE00Compat";
import { DeltaE94Compat } from "./DeltaE94Compat";
import { ColorAdapter } from "../convert";
import { ColorSpaceName } from "../colorspaces";

// TODO: Hue weight not doing anything on CIE1994
// L & C < 1 causes distance over 100
// TODO: L & C weights don't effect output range of 0 to 100 in CIE2000, but Hue weight DOES
// if H > 1, stays the same, but H < 1 causes greater than 100

/**
 * maps a FormulaSettings object into an object which has method getDeltaE
 * passes off the calculation to an internal calculator object which depends on the algo
 *
 * settings are readonly because the calculator is only created once, in the constructor
 */
export class Formula implements FormulaSettings, DeltaECalculator {
  public readonly algo: Algo;

  public readonly model: ColorSpaceName;

  public readonly weights: number[];

  private readonly calculator: DeltaECalculator;

  /**
   * store the passed-in settings so that this object also fulfills the FormulaSettings interface
   * includes defaults so that each setting is optional
   *
   * calculator object is created in the constructor based on the settings
   */
  constructor({ algo, model, weights }: Partial<FormulaSettings>) {
    this.algo = algo || "CIE2000";
    this.model = model || "lch";
    this.weights = weights || [1, 1, 1, 1];
    this.calculator = this.createCalculator();
  }

  /**
   * switch between calculator classes based on the algorithm
   * all calculators can be constructed from FormulaSettings
   */
  private createCalculator(): DeltaECalculator {
    switch (this.algo) {
      case "CIE1994":
        return new DeltaE94Compat(this);
      case "CIE2000":
        return new DeltaE00Compat(this);
      case "Euclidean":
        return new EuclideanCalculator(this);
      default:
        throw new Error(`Unknown formula name ${this.algo}`);
    }
  }

  /**
   * pass off the calculation to the internal class
   * implement as a function rather than returning the calculator method
   * because that creates problems with ambiguous "this"
   */
  getDeltaE(a: ColorAdapter, b: ColorAdapter): number {
    return this.calculator.getDeltaE(a, b);
  }
}
