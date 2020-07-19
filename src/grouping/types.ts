import {ChannelAccessor, ChannelName} from "../spacesChannels/types";

export interface ColorClassification {
    name: string;
    hexes: string[];
    definitions?: PropertyConstraint[];
    correlatedChannels?: (ChannelAccessor | string)[];
}

export interface PropertyConstraint {
    property: ChannelName;
    min: number;
    max: number;
}
