import {splitInGroup} from "./shuffledData";
import {BoundaryModel} from "./BoundaryModel";
import {I_ColorAdapter} from "../color/types";
import ChannelAdapter from "../spacesChannels/ChannelAdapter";
import {GroupedColor, I_BinaryClassifier, I_Boundary, I_Testable} from "./types";

interface Result {
    color: I_ColorAdapter;
    channel: number;
    predicted: boolean;
}

/**
 * applies the generic boundary model -- which takes any numeric data -- to the color data set
 * determines whether or not a color is in the specified group based on the value of the specified channel only
 *
 * the model internally contains a BoundaryModel, but also knows what group and channel it represents
 */

export class ChannelBoundaryModel implements I_BinaryClassifier<I_ColorAdapter>, I_Testable<I_ColorAdapter, Result>, I_Boundary {

    public model: I_BinaryClassifier<number> & I_Boundary;
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
        const valuesIn = inGroup.map(({color}) => color.get(channel)).filter(n => !isNaN(n));
        const valuesOut = notInGroup.map(({color}) => color.get(channel)).filter(n => !isNaN(n));

        this.model = new BoundaryModel(valuesIn, valuesOut);
    }

    /**
     * this is good, but want to somehow return the channel value
     */
    public predict(input: I_ColorAdapter): boolean {
        const value = input.get(this.channel);
        return this.model.predict(value);
    }

    /**
     * fulfills I_Testable interface
     */
    public predictResult(color: I_ColorAdapter): Result {
        const channel = color.get(this.channel);
        const predicted = this.model.predict(channel);
        return {
            color,
            channel,
            predicted,
        }
    }

    get cutoff() {
        return this.model.cutoff;
    }

    get isGreater() {
        return this.model.isGreater;
    }

}
