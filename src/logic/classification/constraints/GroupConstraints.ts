import { MatchError, PropertyConstraint } from "./PropertyConstraint";
import { ColorAdapter } from "../../convert";
import { PropertyDef } from "./constraint-data";

export interface MatchResult {
  matches: boolean;
  errors: MatchError[];
}

/**
 * Combines multiple conditions into one test.
 *
 * in the future could have targets where the difference matters,
 * and use that to calculate a match score
 * ie. a neon with saturation of 100 is a better match than one with saturation 90
 *
 * but for now, all conditions are binary pass/fail rules only
 */
export class GroupConstraints {
  public readonly conditions: PropertyConstraint[];

  constructor(data: PropertyDef[]) {
    this.conditions = data.map((raw) => new PropertyConstraint(raw));
  }

  public colorFits(
    color: ColorAdapter,
    reportAll: boolean = true,
    fuzz = 0.1
  ): MatchResult {
    const errors: MatchError[] = [];

    // Note: not using a forEach loop in order to support the `break`
    // eslint-disable-next-line no-restricted-syntax
    for (const condition of this.conditions) {
      const error = condition.getMatchError(color, fuzz);
      if (error) {
        errors.push(error);
        if (!reportAll) {
          break;
        }
      }
    }

    return {
      matches: errors.length === 0,
      errors,
    };
  }
}
