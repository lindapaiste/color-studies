import { ModelAdapter } from "../spacesChannels/ModelAdapter";
import { ColorSpaceName } from "../spacesChannels/types";
import { IColorAdapter } from "../color/types";

/**
 * Channel and Model gradient can share the same interface
 * requires that they have a function colors()
 * which takes a count and returns an array of color objects
 */
export interface IGradient {
  colors(count: number): IColorAdapter[];
  model: ModelAdapter<ColorSpaceName>;
}
