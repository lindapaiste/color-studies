import { ColorAdapter } from "../convert";
import { ModelAdapter } from "../colorspaces";

/**
 * Channel and Model gradient can share the same interface
 * requires that they have a function colors()
 * which takes a count and returns an array of color objects
 */
export interface IGradient {
  colors(count: number): ColorAdapter[];
  model: ModelAdapter;
}
