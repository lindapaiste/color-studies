import { round } from "lib";
import { ChannelAdapter, ChannelSlug, getChannel } from "../../colorspaces";
import { ColorAdapter } from "../../convert";
import { PropertyDef } from "./constraint-data";

export interface MatchError {
  property: ChannelSlug;
  value: number;
  condition: PropertyConstraint;
  message: string;
}

/**
 * Return detailed data for each modification.
 */
export interface Modification {
  /**
   * The new, modified color.
   */
  color: ColorAdapter;
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
 * Shared interface for property and group constraints
 */
export interface Constraint {
  /**
   * Check if a color passes the restriction.
   */
  colorFits(color: ColorAdapter, fuzz?: number): boolean;

  /**
   * Create a modified version of the color in order to pass the restriction.
   */
  enforce(color: ColorAdapter, fuzz?: number): Modification;
}

export const DEFAULT_FUZZ = 0.01;

/**
 * Turns the stored PropertyDef into an object with test methods.
 *
 * Check if the condition is met by a color, allowing for rounding errors with fuzz.
 *
 * Rather than building out from a fuzz to an allowance based on the channel values,
 * can instead normalize the constraint
 */
export class PropertyConstraint {
  public readonly min: number; // normalized

  public readonly max: number; // normalized

  public readonly channel: ChannelAdapter;

  constructor(data: PropertyDef) {
    this.channel = getChannel(data.channel);
    this.min = this.channel.normalize(data.min);
    this.max = this.channel.normalize(data.max);
  }

  /**
   * Check if a color passes the restriction.
   */
  public colorFits(color: ColorAdapter, fuzz: number = DEFAULT_FUZZ): boolean {
    const value = color.get(this.channel, true);
    return value >= this.min - fuzz && value <= this.max + fuzz;
  }

  /**
   * Helper to create the MatchError
   */
  private createError = (value: number, message: string): MatchError => ({
    value,
    message,
    condition: this,
    property: this.channel.key,
  });

  /**
   * Needs a small allowance mainly to account for rounding errors
   * when setting value exactly to the min or max.
   *
   * Returns a MatchError object if failed, or undefined if passed.
   */
  public getMatchError = (
    color: ColorAdapter,
    fuzz: number = DEFAULT_FUZZ
  ): MatchError | undefined => {
    // look at the normalized value
    const value = color.get(this.channel, true);
    if (value < this.min - fuzz) {
      return this.createError(
        value,
        `value of ${round(value, 4)} is below the required minimum of ${
          this.min
        }`
      );
    }
    if (value > this.max + fuzz) {
      return this.createError(
        value,
        `value of ${round(value, 4)} is above the required maximum of ${
          this.max
        }`
      );
    }
    return undefined;
  };
}
