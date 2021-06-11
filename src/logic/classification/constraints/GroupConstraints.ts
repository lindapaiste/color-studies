import { IColorAdapter } from "../../color/types";
import { PropertyConstraint, PropertyDef } from "./PropertyConstraint";
import { ChannelSlug } from "../../spacesChannels/colorSpaces";

export interface MatchError {
  property: ChannelSlug;
  condition: PropertyConstraint;
  message: string;
}

export interface MatchResult {
  matches: boolean;
  errors: MatchError[];
}

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
    color: IColorAdapter,
    reportAll: boolean = true,
    fuzz = 0.1
  ): MatchResult {
    const errors: MatchError[] = [];

    for (let condition of this.conditions) {
      const error = condition.getMatchError(color, fuzz);
      if (error) {
        errors.push({
          condition,
          property: condition.channel.slug,
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
