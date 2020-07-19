import { ColorClassification} from "./types";
import { round } from "lodash";
import {PropertyConstraint} from "./types";
import {I_ColorAdapter} from "../packages/color-adapter";
import {nameToAccessor} from "../spacesChannels/accessorConversion";
import {getAllowance} from "../spacesChannels/channelMaxes";

/**
 * in the future could have targets where the difference matters,
 * and use that to calculate a match score
 * ie. a neon with saturation of 100 is a better match than one with saturation 90
 *
 * but for now, all conditions are binary pass/fail rules only
 */
export interface Result {
  matches: boolean;
  errors: Error[];
}

export interface Error {
  property: PropertyKey;
  message: string;
}

export const fitsCategory = (
  color: I_ColorAdapter,
  category: ColorClassification,
  reportAll: boolean = true
): Result => fitsConditions(color, category.definitions, reportAll);

/**
 * for runtime usage, do not need to check all conditions after one has failed
 * use flag reportAll to determine whether additional conditions will be checked
 *
 * fuzz is important because need to allow for some tiny rounding errors
 * when setting a value to force it into rance and then checking if it's actually in the range
 */
export const fitsConditions = (
  color: I_ColorAdapter,
  conditions: PropertyConstraint[] = [],
  reportAll: boolean = true,
  fuzz = 0.1
): Result => {
  const errors: Error[] = [];

  for (let condition of conditions) {
    const { property } = condition;
    const value = color.get(nameToAccessor(property));
    const error = getConditionError(
      value,
      condition,
      getAllowance(property, fuzz, color)
    );
    if (error) {
      errors.push({
        property,
        message: error
      });
    }
    if (errors.length && !reportAll) {
      break;
    }
  }

  return {
    matches: errors.length === 0,
    errors
  };
};

/**
 * returns false if passed, or error message string if failed
 */
export const getConditionError = (
  value: number,
  condition: PropertyConstraint,
  allowance: number = 0
): string | false => {
  if (value < condition.min - allowance) {
    return `value of ${round(value, 4)} is below the required minimum of ${
      condition.min
    }`;
  } else if (value > condition.max + allowance) {
    return `value of ${round(value, 4)} is above the required maximum of ${
      condition.max
    }`;
  } else return false;
};
