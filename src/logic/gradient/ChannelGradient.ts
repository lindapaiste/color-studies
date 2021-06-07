import { ChannelAdapter } from "../spacesChannels/ChannelAdapter";
import { ColorSpaceName } from "../spacesChannels/types";
import { TransformPair } from "../adjustment/transforms";
import { ModelGradient } from "./ModelGradient";
import { IGradient } from "./types";
import { IColorAdapter } from "../color/types";

/**
 * start from one initial color and change its value along one channel
 *
 * can pass in a custom start and end value, but defaults to using the channel min and max
 * assume that start and end value are not normalized??
 */

export interface Props {
  initial: IColorAdapter;
  channel: ChannelAdapter;
  transform?: boolean | TransformPair;
  start?: number;
  end?: number;
}

/**
 * internally uses the ModelGradient class
 */
export class ChannelGradient implements IGradient {
  private internal: ModelGradient<ColorSpaceName>;

  constructor({ initial, channel, transform = false, ...props }: Props) {
    const start = initial.set(channel, props.start ?? channel.min);
    const end = initial.set(channel, props.end ?? channel.max);
    this.internal = new ModelGradient({
      start,
      end,
      model: channel.modelObject,
      // only apply transform to the one channel.  but it shouldn't matter if it was applied to others because there is no change in the other channels
      transform: channel.modelObject.makeTuple((i) =>
        i === channel.offset ? transform : false
      ),
    });
  }

  public colors(count: number): IColorAdapter[] {
    return this.internal.colors(count);
  }

  get model() {
    return this.internal.model;
  }
}

/**
 * using the class takes two steps ( create and call colors() ),
 * but this function gets colors in one step
 */

export type GetGradientProps = Props & { count: number };

export const getGradientColors = ({
  count,
  ...props
}: GetGradientProps): IColorAdapter[] =>
  new ChannelGradient(props).colors(count);
