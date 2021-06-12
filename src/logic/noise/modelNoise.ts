import { noisyChannelValue } from "./channelNoise";
import { ColorSpaceName, ColorTuple } from "../colorspaces/types";
import { IModelNoise, INoiseCreator, ModelNoiseSettings } from "./types";
import { TupleClass } from "../colorspaces/TupleClass";
import { ColorAdapter } from "../convert";

export interface CalcProps<CS extends ColorSpaceName> {
  noiseRatio: number;
  values: TupleClass<CS>;
  weights?: ColorTuple<CS>;
}

export const calcNoisy = <CS extends ColorSpaceName>({
  values: tuple,
  noiseRatio,
  weights,
}: CalcProps<CS>): TupleClass<CS> => {
  /**
   * default to 1 if no weights array is passed in
   * or if it has the wrong number of entries
   */
  const getWeight = (i: number): number => weights?.[i] ?? 1;

  return tuple.map((value, i) =>
    noisyChannelValue({
      channel: tuple.channels[i],
      value,
      noiseRatio: noiseRatio * getWeight(i),
    })
  );
};

export const withModelNoise = <CS extends ColorSpaceName>({
  color,
  colorSpace,
  ...props
}: Props<CS>): ColorAdapter => {
  const noisy = calcNoisy({
    ...props,
    values: color.toCs(colorSpace),
  });
  return ColorAdapter.fromTuple(noisy);
};

/**
 * uses the same setup as Formula, where it is created from settings, but also serves as an access point to those settings
 */
export class ModelNoise
  implements INoiseCreator, ModelNoiseSettings, IModelNoise
{
  public readonly colorSpace: ColorSpaceName;

  public readonly noiseRatio: number;

  public readonly weights: ColorTuple;

  constructor({ colorSpace, noiseRatio, weights }: ModelNoiseSettings) {
    this.colorSpace = colorSpace;
    this.noiseRatio = noiseRatio;
    this.weights = weights;
  }

  getNoisy(base: ColorAdapter): ColorAdapter {
    return withModelNoise({ color: base, ...this });
  }
}

/**
 * can apply noise to multiple channels, but they should all be part of the same color model
 * otherwise new changes with either override or compound previous changes affecting the same channel
 */

export type Props<CS extends ColorSpaceName> = Omit<CalcProps<CS>, "values"> & {
  color: ColorAdapter;
  colorSpace: CS;
};
