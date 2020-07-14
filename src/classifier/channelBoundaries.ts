import {splitInGroup} from "./PlotFeatures";
import {boundaryModel, BoundaryModelAcc} from "./boundaryModel";
import {I_ColorAdapter} from "../packages/color-adapter";
import {ChannelAccessor} from "../spacesChannels/types";

interface DataPoint {
    group: string,
    color: I_ColorAdapter,
}

export const channelBoundaries = (group: string, data: DataPoint[], channel: ChannelAccessor): BoundaryModelAcc => {
    const [inGroup, notInGroup] = splitInGroup(data, group);

    /**
     * need to ignore NaN for hue, or else thing get screwed up further down
     */
    const valuesIn = inGroup.map(({color}) => color.get(channel)).filter(n => !isNaN(n));
    const valuesOut = notInGroup.map(({color}) => color.get(channel)).filter(n => !isNaN(n));

    return boundaryModel(valuesIn, valuesOut);
};

