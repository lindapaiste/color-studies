import {ColorPropKey} from "../packages/types";
import {ChannelAccessor} from "../spacesChannels/types";

export interface ColorClassification {
    name: string;
    hexes: string[];
    definitions?: PropertyConstraint[];
    correlatedChannels?: (ChannelAccessor | string)[];
}

export interface PropertyConstraint {
    property: ColorPropKey;
    min: number;
    max: number;
}
