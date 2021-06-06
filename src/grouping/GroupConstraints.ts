import { MatchError, MatchResult, PropertyDef } from "./types";
import { I_ColorAdapter } from "../color/types";
import { PropertyConstraint } from "./PropertyConstraint";

/**
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
    color: I_ColorAdapter,
    reportAll: boolean = true,
    fuzz = 0.1
  ): MatchResult {
    const errors: MatchError[] = [];

    for (let condition of this.conditions) {
      const error = condition.getMatchError(color, fuzz);
      if (error) {
        errors.push({
          condition,
          property: condition.channel.name,
          message: error,
        });
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

export default GroupConstraints;
