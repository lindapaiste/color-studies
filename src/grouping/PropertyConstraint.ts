import ChannelAdapter from "../spacesChannels/ChannelAdapter";
import { PropertyDef } from "./types";
import { getChannel } from "../spacesChannels/channels";
import { I_ColorAdapter } from "../color/types";
import { round } from "../lib";

/**
 * rather than building out from a fuzz to an allowance, can instead normalize the constraint
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
   * returns false if passed, or error message string if failed
   * needs a small allowance mainly to account for rounding errors when setting value exactly to the min or max
   */
  getMatchError = (
    color: I_ColorAdapter,
    allowance: number = 0
  ): string | false => {
    // look at the normalized value
    const value = color.get(this.channel, true);
    if (value < this.min - allowance) {
      return `value of ${round(value, 4)} is below the required minimum of ${
        this.min
      }`;
    } else if (value > this.max + allowance) {
      return `value of ${round(value, 4)} is above the required maximum of ${
        this.max
      }`;
    } else return false;
  };
}

export default PropertyConstraint;

/**
 * transforms a fuzz percent into a number
 * ie. 0.05 for hue => 18, 0.05 for saturation => 5
 * take into account the color-specific range?
 */
export const getAllowance = (
  channel: ChannelAdapter,
  fuzzPercent: number,
  // color?: I_ColorAdapter
) => channel.range * fuzzPercent; // is is divided by 100 or not?
