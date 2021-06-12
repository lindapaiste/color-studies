import { ModelAdapter } from "../colorspaces/ModelAdapter";
import { ColorSpaceName } from "../colorspaces/types";
import { ColorAdapter } from "../convert";

/**
 * Channel and Model gradient can share the same interface
 * requires that they have a function colors()
 * which takes a count and returns an array of color objects
 */
export interface IGradient {
  colors(count: number): ColorAdapter[];
  model: ModelAdapter<ColorSpaceName>;
}
