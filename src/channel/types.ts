import {I_ColorAdapter} from "../packages/ColorAdapter";
import {ModelAdapter} from "../spacesChannels/ModelAdapter";
import {ColorSpaceName} from "../spacesChannels/types";

/**
 * Channel and Model gradient can share the same interface
 * requires that they have a function colors()
 * which takes a count and returns an array of color objects
 */
export interface I_Gradient {
    colors(count: number): I_ColorAdapter[];
    model: ModelAdapter<ColorSpaceName>;
}
