import { splitInGroup } from "../../training/shuffledData";
import { BoundaryModel } from "./BoundaryModel";
import { ChannelAdapter } from "../../../colorspaces/ChannelAdapter";
import {
  GroupedColor,
  BinaryClassifier,
  Boundary,
  ITestable,
} from "../../types";
import { ColorAdapter } from "../../../convert";

interface Result {
  color: ColorAdapter;
  channel: number;
  predicted: boolean;
}

/**
 * applies the generic boundary model -- which takes any numeric data -- to the color data set
 * determines whether or not a color is in the specified group based on the value of the specified channel only
 *
 * the model internally contains a BoundaryModel, but also knows what group and channel it represents
 */

export class ChannelBoundaryModel
  implements
    BinaryClassifier<ColorAdapter>,
    ITestable<ColorAdapter, Result>,
    Boundary
{
  public model: BinaryClassifier<number> & Boundary;

  public group: string;

  public channel: ChannelAdapter;

  /**
   * build the model in the constructor
   */
  constructor(group: string, data: GroupedColor[], channel: ChannelAdapter) {
    this.channel = channel;
    this.group = group;

    const [inGroup, notInGroup] = splitInGroup(data, group);

    /**
     * need to ignore NaN for hue, or else thing get screwed up further down
     */
    const valuesIn = inGroup
      .map(({ color }) => color.get(channel))
      .filter((n) => !Number.isNaN(n));
    const valuesOut = notInGroup
      .map(({ color }) => color.get(channel))
      .filter((n) => !Number.isNaN(n));

    this.model = new BoundaryModel(valuesIn, valuesOut);
  }

  /**
   * this is good, but want to somehow return the channel value
   */
  public predict(input: ColorAdapter): boolean {
    const value = input.get(this.channel);
    return this.model.predict(value);
  }

  /**
   * fulfills ITestable interface
   */
  public predictResult(color: ColorAdapter): Result {
    const channel = color.get(this.channel);
    const predicted = this.model.predict(channel);
    return {
      color,
      channel,
      predicted,
    };
  }

  get cutoff() {
    return this.model.cutoff;
  }

  get isGreater() {
    return this.model.isGreater;
  }
}
