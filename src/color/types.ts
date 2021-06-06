import {
  ChannelAccessor,
  ColorSpaceName,
  ColorTuple,
} from "../spacesChannels/types";
import { ModelAdapter } from "../spacesChannels/ModelAdapter";
import { TupleClass } from "../spacesChannels/TupleClass";
import { ChannelAdapter } from "../spacesChannels/ChannelAdapter";

/**
 * interface requires that object can be converted to a number tuple of any type
 * and that it can be constructed from a number tuple of any type
 *
 * can get or set the value of any channel
 *
 * ideally from() would be static, but this gets complicated with typescript
 */
export interface I_ColorAdapter extends I_GetHex {
  to<CS extends ColorSpaceName>(
    colorSpace: CS | ModelAdapter<CS>,
    rounded?: boolean
  ): ColorTuple<CS>;

  // eventually want toClassed() to replace existing to(), but don't want to break anything
  toClassed<CS extends ColorSpaceName>(
    colorSpace: CS | ModelAdapter<CS>
  ): TupleClass<CS>;

  from<CS extends ColorSpaceName>(
    values: ColorTuple<CS> | TupleClass<CS>,
    colorSpace: CS | ModelAdapter<CS>
  ): I_ColorAdapter;

  get(
    channel: ChannelAccessor | ChannelAdapter,
    normalized?: boolean,
    precision?: number
  ): number;

  set(
    accessor: ChannelAccessor | ChannelAdapter,
    value: number,
    normalized?: boolean
  ): I_ColorAdapter;
}

export interface I_GetHex {
  hex(): string;
}

export interface PropColor {
  color: I_ColorAdapter;
}

export interface PropColorArray {
  colors: I_ColorAdapter[];
}
