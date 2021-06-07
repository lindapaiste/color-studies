// an array of transforms for each channel
import { ifDefined, tupleMap } from "lib";
import { ChannelCountTuple, ColorSpaceName } from "../spacesChannels/types";
import { ModelAdapter } from "../spacesChannels/ModelAdapter";
import { TupleClass } from "../spacesChannels/TupleClass";
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

  constructor(props: Props<CS>) {
    this.model = props.model;
    this.normalized = ifDefined(props.normalized, false);
    let transforms = props.transform;
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
    const initial = tuple.getEither(this.normalized);
    const mapped = tupleMap(initial, (value, i) => {
      const transform = this.transforms[i]; // don't get the right type inference if using ternary on this.transforms[i]
      return transform === false ? value : transform[direction](value);
    });
    return new TupleClass(mapped, this.model, this.normalized);
  }

  public applyPre(tuple: TupleClass<CS>): TupleClass<CS> {
    return this.apply(tuple, "pre");
  }

  public applyPost(tuple: TupleClass<CS>): TupleClass<CS> {
    return this.apply(tuple, "post");
  }
}
