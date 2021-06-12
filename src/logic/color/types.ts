import { ColorSpaceName, ColorTuple } from "../spacesChannels/types";
import { ModelAdapter } from "../spacesChannels/ModelAdapter";
import { TupleClass } from "../spacesChannels/TupleClass";
import { ChannelArg } from "../spacesChannels/channels";

/**
 * interface requires that object can be converted to a number tuple of any type
 *
 * can get or set the value of any channel
 */
export interface IColorAdapter extends CanGetHex {
  to<CS extends ColorSpaceName>(
    colorSpace: CS | ModelAdapter<CS>,
    rounded?: boolean
  ): ColorTuple<CS>;

  // eventually want toClassed() to replace existing to(), but don't want to break anything
  toClassed<CS extends ColorSpaceName>(
    colorSpace: CS | ModelAdapter<CS>
  ): TupleClass<CS>;

  get(channel: ChannelArg, normalized?: boolean, precision?: number): number;

  set(channel: ChannelArg, value: number, normalized?: boolean): IColorAdapter;
}

export interface CanGetHex {
  hex(): string;
}

export interface PropColor {
  color: IColorAdapter;
}

export interface PropColorArray {
  colors: IColorAdapter[];
}
