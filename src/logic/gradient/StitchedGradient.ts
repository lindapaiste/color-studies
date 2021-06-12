import { ModelGradient, Props as GradientProps } from "./ModelGradient";
import { ColorSpaceName } from "../colorspaces/types";
import { IGradient } from "./types";
import { ModelAdapter } from "../colorspaces/ModelAdapter";
import { ColorAdapter } from "../convert";

/**
 * rather than just going from A to B, can create a gradient from any number of colors
 *
 * very basic right now - there is a lot more that could be done but isn't needed
 *
 * always includes intermediate values as stop points even if the count is not evenly divisible
 * to the returned count does not always equal the requested count
 */

export type Props<CS extends ColorSpaceName> = Pick<
  GradientProps<CS>,
  "model" | "transform"
> & {
  colors: ColorAdapter[];
};

export class StitchedGradient<CS extends ColorSpaceName> implements IGradient {
  public readonly model: ModelAdapter<CS>; // not using get() because of possible empty gradients array

  private readonly gradients: ModelGradient<CS>[];

  constructor({ colors, model, transform }: Props<CS>) {
    this.model = model;
    this.gradients = [];
    // gracefully handle too-short arrays
    if (colors.length === 0) {
      console.warn("creating a gradient without any colors");
    } else if (colors.length === 1) {
      this.gradients.push(
        new ModelGradient({
          model,
          transform,
          start: colors[0],
          end: colors[0],
        })
      );
    } else {
      // start at 1 rather than 0 because also accessing the previous
      for (let i = 1; i < colors.length; i++) {
        this.gradients.push(
          new ModelGradient({
            model,
            transform,
            start: colors[i - 1],
            end: colors[i],
          })
        );
      }
    }
  }

  colors(count: number): ColorAdapter[] {
    // early exit on empty to avoid divide by zero
    if (this.gradients.length === 0) return [];
    const countPer = Math.ceil(count / this.gradients.length);
    return this.gradients.flatMap((o) => o.colors(countPer));
  }
}
