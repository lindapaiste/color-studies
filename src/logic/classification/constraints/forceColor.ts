import { last, round } from "lib";
import { IColorAdapter } from "../../color/types";
import { PropertyConstraint } from "./PropertyConstraint";
import { ChannelAdapter } from "../../spacesChannels/ChannelAdapter";
import { GroupConstraints } from "./GroupConstraints";

/**
 * Modify a color such that it fits to pre-defined constraints of a group
 */

export interface Props {
  /**
   * The initial color.
   */
  color: IColorAdapter;
  /**
   * The ruleset to force into.
   */
  rules: GroupConstraints;
  /**
   * Break out after a number of attempts if it is not possible to fit all constraints.
   */
  maxAttempts?: number;
  /**
   * Allowable fuzz when checking against rules.  Allows for some rounding error.
   */
  fuzz?: number;
}

/**
 * Store and return the data for each modification.
 */
export interface Modification {
  /**
   * The new, modified color.
   */
  color: IColorAdapter;
  /**
   * The channel which was changed.
   */
  channel: ChannelAdapter;
  /**
   * Additional information about the change.
   */
  message: string;
}

/**
 * The final result after many phases of modification
 */
export interface Result {
  /**
   * True if the returned color fits all rules
   */
  passed: boolean;
  /**
   * The final color
   */
  color: IColorAdapter;
  /**
   * An array with the data for all steps.
   */
  phases: Modification[];
}

export const forceColor = ({
  color: startColor,
  rules,
  maxAttempts = 10,
  fuzz = 0.1,
}: Props): Result => {
  const phases: Modification[] = [];

  /**
   * Applies one rule and stores the changes to the phases array.
   */
  const applyRule = (
    initial: IColorAdapter,
    { channel, min, max }: PropertyConstraint
  ) => {
    const value = initial.get(channel, true);
    if (value > max) {
      const color = initial.set(channel, max, true);
      phases.push({
        color,
        channel,
        message: `Set ${channel.slug} from ${round(value, 2)} to ${round(
          max,
          2
        )}`,
      });
    } else if (value < min) {
      const color = initial.set(channel, min, true);
      phases.push({
        color,
        channel,
        message: `Set ${channel.slug} from ${round(value, 2)} to ${round(
          min,
          2
        )}`,
      });
    }
  };

  let i = 0;

  while (i < maxAttempts) {
    const currentColor = last(phases)?.color ?? startColor;
    const { matches, errors } = rules.colorFits(currentColor, false, fuzz);
    /**
     * Once all conditions have been passed, can return.
     */
    if (matches) {
      return {
        passed: true,
        color: currentColor,
        phases,
      };
    }

    /**
     * If the conditions were NOT met, modify one property based on the returned error.
     *
     * Note: previously edited all values here, but now only modifying one per cycle.
     * `errors` is still an array, but should have only one entry due to the `reportAll` flag.
     */
    errors.map((e) => applyRule(currentColor, e.condition));

    i++;
  }

  /**
   * If here, then maxAttempts has been hit without a match.
   */
  return {
    passed: false,
    color: last(phases)?.color ?? startColor,
    phases,
  };
};
