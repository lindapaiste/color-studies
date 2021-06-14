import { intervals, makeArray } from "lib";
import { TransformPair } from "../adjustment/transforms";
import {
  ChannelCountTuple,
  ColorSpaceName,
  ColorTuple,
  ModelAdapter,
  TupleClass,
} from "../colorspaces";
import { ModelTransform } from "./ModelTransform";
import { IGradient } from "./types";
import { ColorAdapter } from "../convert";

export interface Props<CS extends ColorSpaceName> {
  start: ColorAdapter;
  end: ColorAdapter;
  model: ModelAdapter<CS>;
  transform?: boolean | ChannelCountTuple<CS, boolean | TransformPair>;
}

/**
 * gradient always uses normalized?
 *
 * values are linearly separated,
 * but can use a pre and post transform to change that spacing
 * for example, want spaced based on x-squared value for RGB
 */
export class ModelGradient<CS extends ColorSpaceName> implements IGradient {
  private readonly start: TupleClass<CS>;

  private readonly end: TupleClass<CS>;

  private readonly transform: ModelTransform<CS>;

  public readonly model: ModelAdapter<CS>; // could instead do get model() { return this.start.model; }

  constructor({ start, end, model, transform = false }: Props<CS>) {
    this.model = model;
    // transform class fills in the gaps from transform prop
    this.transform = new ModelTransform({ model, transform, normalized: true });
    // internally stored start and end are already transformed
    this.start = this.transform.applyPre(start.toCs(model));
    this.end = this.transform.applyPre(end.toCs(model));
  }

  public colors(count: number): ColorAdapter[] {
    // get 3 (or 4) vectors with the values of the channel
    const vectors = this.model.channels.map((channel, i) =>
      intervals(this.start[i], this.end[i], count)
    );
    // make a color object from an index of the vectors
    const colorI = (i: number): ColorAdapter => {
      const values = vectors.map((array) => array[i]) as ColorTuple<CS>;
      // post-transform each value
      const tuple = this.transform.applyPost(
        new TupleClass(values, this.model, true)
      );
      return ColorAdapter.fromTuple(tuple);
    };
    return makeArray(count, colorI);
  }
}
