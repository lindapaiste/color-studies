import { sortBy } from "lodash";
import { GroupedColor } from "../../types";
import { ChannelBoundaryModel } from "./ChannelBoundaryModel";
import { GroupModelTest } from "../../accuracy/GroupModelTest";
import { ChannelAdapter } from "../../../spacesChannels/ChannelAdapter";
import { ConfusionMatrix } from "../../accuracy/ConfusionMatrix";
import { allChannels } from "../../../spacesChannels/channels";

export interface IChannelModel {
  channel: ChannelAdapter;
  model: ChannelBoundaryModel;
  accuracy: ConfusionMatrix;
}

/**
 * for a given group, find the boundaries for every channel
 *
 * should it find all in the constructor?  or are there cases where I want a few but not all?
 */

export class AllChannelBoundaries {
  public readonly group: string;

  private readonly trainingData: GroupedColor[];

  private models: IChannelModel[];

  public constructor(group: string, data: GroupedColor[]) {
    this.group = group;
    // split data into training and testing??
    this.trainingData = data;

    this.models = [];
  }

  private createModel = (channel: ChannelAdapter): IChannelModel => {
    const model = new ChannelBoundaryModel(
      this.group,
      this.trainingData,
      channel
    );
    const tester = new GroupModelTest(model);
    tester.test(100);
    const { accuracy } = tester;
    return {
      channel,
      model,
      accuracy,
    };
  };

  private findModel = (channel: ChannelAdapter): IChannelModel | undefined =>
    this.models.find((m) => m.channel.key === channel.key);

  /**
   * gets the model either through lookup or creation
   */
  public getModel = (channel: ChannelAdapter): IChannelModel => {
    const found = this.findModel(channel);
    if (found) {
      return found;
    }
    const created = this.createModel(channel);
    this.models.push(created);
    return created;
  };

  /**
   * returns all models sorted by predictiveness in descending order
   */
  public mostAccurateModels = () =>
    sortBy(
      allChannels().map((channel) => this.getModel(channel)),
      (model) =>
        1 -
        Math.max(
          model.accuracy.negativePredictiveValue,
          model.accuracy.positivePredictiveValue
        ) // 1 minus for descending
    );
}
