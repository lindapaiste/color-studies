import { replaceIndex } from "lib";
import { ColorTuple } from "./types";
import { ModelAdapter } from "./ModelAdapter";
import { ModelArg, toModelAdapter } from "./models";
import { ChannelArg, toChannelIndex } from "./channels";
import { ColorSpaceName } from "./colorSpaces";

/**
 * Type for a callback function, as it is used in multiple methods.
 * Receives the value, the index, and the entire object.
 * Can customize the return -- is probably `number` but could be `void`
 */
export type TupleCallback<ThisType, ReturnType = number> = (
  value: number,
  i: number,
  tuple: ThisType
) => ReturnType;

/**
 * Wrapper around a color values tuple can act as an array ( implements ArrayLike ),
 * but can also handle normalization and denormalization of its values.
 *
 * Methods normalize() and deNormalize() allow for chaining
 * and make it clear which values are being used where.
 */
export class TupleClass<CS extends ColorSpaceName = ColorSpaceName>
  implements ArrayLike<number>
{
  /**
   * The raw array values, which are either raw or normalized,
   * depending on the implementation.
   */
  public readonly values: ColorTuple<CS>;

  /**
   * Store a boolean flag regarding whether the values are normalized.
   */
  public readonly isNormalized: boolean;

  /**
   * Needs to access the model object in order to do normalization.
   */
  public readonly model: ModelAdapter<CS>;

  /**
   * construct a TupleClass object from an array of numeric values
   * need to know what model these numbers describe and whether or not they are normalized
   *
   * Expect this constructor to be overwritten such that the `isNormalized`
   * argument is included automatically.
   */
  constructor(
    values: ColorTuple<CS>,
    model: ModelArg<CS>,
    isNormalized: boolean
  ) {
    this.values = values;
    // doesn't matter which format I store in, but one of the two should always be defined
    this.model = toModelAdapter(model);
    this.isNormalized = isNormalized;
  }

  /**
   * index signature to implement ArrayLike
   * saying that it always returns a number because the complex version isn't read properly
   * [i: number]: typeof i extends 0 | 1 | 2 ? number : typeof i extends 3 ? ChannelCount<CS> extends 4 ? number : undefined : undefined;
   * get0() takes the type of 0 as number rather than 0
   *
   * could also access underlying array using a JS Proxy object
   * https:// stackoverflow.com/questions/7891937/is-it-possible-to-implement-dynamic-getters-setters-in-javascript
   */
  [i: number]: number;

  get 0() {
    return this.values[0];
  }

  get 1() {
    return this.values[1];
  }

  get 2() {
    return this.values[2];
  }

  get 3() {
    // cannot be optional due to the index signature
    return this.values[3] as number;
  }

  get length(): number {
    return this.values.length;
  }

  /**
   * Helper method creates a new TupleClass from new values with the
   * same model as the current.
   * Defaults to the same isNormalized as the current, but this can be overwritten.
   * Accepts number[] to make life easy, which is okay since this is private.
   */
  private create(
    values: number[],
    isNormalized = this.isNormalized
  ): TupleClass<CS> {
    return new TupleClass(values as ColorTuple<CS>, this.model, isNormalized);
  }

  /**
   * If normalized, deNormalize. If raw, normalize.
   */
  private flip(): TupleClass<CS> {
    const converter = this.isNormalized
      ? this.model.deNormalize
      : this.model.normalize;
    return this.create(converter(this.values), !this.isNormalized);
  }

  /**
   * Get in either normalized or raw form depending on a boolean argument.
   */
  public to(normalized: boolean): TupleClass<CS> {
    return this.isNormalized === normalized ? this : this.flip();
  }

  /**
   * Chainable normalize method
   */
  normalize(): TupleClass<CS> {
    return this.isNormalized ? this : this.flip();
  }

  /**
   * Chainable deNormalize method
   */
  deNormalize(): TupleClass<CS> {
    return this.isNormalized ? this.flip() : this;
  }

  /**
   * Implements a map() method which takes the same sort of callback as Array.prototype.map().
   * Callback receives the value, the index, and the entire object.
   *
   * Returns a new Tuple instance -- does not mutate the current.
   */
  map(callback: TupleCallback<this>): TupleClass<CS> {
    const values = this.values.map((v, i) => callback(v, i, this));
    return this.create(values);
  }

  /**
   * Modify a single channel. Replace one value of the tuple with a new value.
   *
   * Can provide the new value directly or use a map function.
   * Can select the channel by index or by slug/name/accessor.
   *
   * Returns a new Tuple instance -- does not mutate the current.
   */
  replace(
    channel: number | ChannelArg,
    replacement: number | TupleCallback<this>
  ): TupleClass<CS> {
    const index = toChannelIndex(channel);
    const newValue =
      typeof replacement === "number"
        ? replacement
        : replacement(this[index], index, this);
    return this.create(replaceIndex(this.values, index, newValue));
  }

  /**
   * Symbol.iterator allows for destructuring of the class itself,
   * ie const [r, g, b] = tuple
   */
  [Symbol.iterator] = () => this.values[Symbol.iterator]();

  /**
   * Shortcut to access the channels of the model
   */
  get channels() {
    return this.model.channels;
  }
}
