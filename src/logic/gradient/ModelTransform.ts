// an array of transforms for each channel
import { tupleMap } from "lib";
import {
  ChannelCountTuple,
  ColorSpaceName,
  ModelAdapter,
  TupleClass,
} from "../colorspaces";
import { getStandardTransform, TransformPair } from "../adjustment/transforms";

export type ModelTransformArray<CS extends ColorSpaceName> = ChannelCountTuple<
  CS,
  boolean | TransformPair
>;
export type ModelTransformProp<CS extends ColorSpaceName> =
  | ModelTransformArray<CS>
  | true
  | false;

export interface Props<CS extends ColorSpaceName> {
  model: ModelAdapter<CS>;
  transform: true | false | ChannelCountTuple<CS, boolean | TransformPair>;
  normalized?: boolean;
}

export class ModelTransform<CS extends ColorSpaceName> {
  private readonly model: ModelAdapter<CS>;

  // after mapping, each channel is set and can only be false or a pair
  private readonly transforms: ChannelCountTuple<CS, false | TransformPair>;

  private readonly normalized: boolean;

  constructor({ model, normalized = false, transform }: Props<CS>) {
    this.model = model;
    this.normalized = normalized;
    let transforms = transform;
    // TODO: handling of transforms is a mess
    // handle all true / all false
    if (typeof transforms === "boolean") {
      transforms = this.model.makeTuple(transforms);
    }
    // now is always a tuple
    // handle true means use the default
    transforms = tupleMap(transforms, (v, i) =>
      v === true
        ? getStandardTransform(this.model.channels[i], this.normalized)
        : v
    );
    this.transforms = transforms as ChannelCountTuple<
      CS,
      false | TransformPair
    >;
  }

  /**
   * tuple class has access to both the normalized and non-normalized versions,
   * so can choose the right one based on this.normalized
   *
   * shared logic between pre and post transforms
   */
  public apply(
    tuple: TupleClass<CS>,
    direction: keyof TransformPair
  ): TupleClass<CS> {
    return tuple.to(this.normalized).map((value, i) => {
      const transform = this.transforms[i]; // don't get the right type inference if using ternary on this.transforms[i]
      return transform === false ? value : transform[direction](value);
    });
  }

  public applyPre(tuple: TupleClass<CS>): TupleClass<CS> {
    return this.apply(tuple, "pre");
  }

  public applyPost(tuple: TupleClass<CS>): TupleClass<CS> {
    return this.apply(tuple, "post");
  }
}
