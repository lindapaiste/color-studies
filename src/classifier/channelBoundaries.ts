import {splitInGroup} from "./shuffledData";
import {boundaryModel, BoundaryModelAcc} from "./boundaryModel";
import {ChannelAccessor} from "../spacesChannels/types";
import {I_ConfusionMatrix} from "./ConfusionMatrix";
import {I_ColorAdapter} from "../color/types";

/**
 * applies the generic boundary model -- which takes any numeric data -- to the color data set
 * determines whether or not a color is in the specified group
 * based on the value of the specified channel only
 */

interface DataPoint {
    group: string,
    color: I_ColorAdapter,
}

export const channelBoundaries = (group: string, data: DataPoint[], channel: ChannelAccessor): BoundaryModelAcc<I_ConfusionMatrix> => {
    const [inGroup, notInGroup] = splitInGroup(data, group);

    /**
     * need to ignore NaN for hue, or else thing get screwed up further down
     */
    const valuesIn = inGroup.map(({color}) => color.get(channel)).filter(n => !isNaN(n));
    const valuesOut = notInGroup.map(({color}) => color.get(channel)).filter(n => !isNaN(n));

    return boundaryModel(valuesIn, valuesOut);
};

