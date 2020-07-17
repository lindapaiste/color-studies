import {ChannelAccessor, ChannelName, ChannelObjectCS} from "./types";
import {getMaxOrFormula, isChannelName} from "./channelMaxes";
import {channelCount, COLOR_SPACE_NAMES, getSpaceChannels} from "./colorSpaces";
import startCase from "lodash/startCase";

/**
 * some channels will have multiple accessors, but just return the first match
 */
export const nameToAccessor = (channel: ChannelName): ChannelAccessor => {
    for (let cs of COLOR_SPACE_NAMES) {
        const channels = getSpaceChannels(cs);
        const i = channels.indexOf(channel);
        if (i !== -1) {
            return [cs, i];
        }
    }
    throw new Error("invalid channel " + channel);
};

export const accessorToName = (accessor: ChannelAccessor): ChannelName => {
    const [colorSpace, offset] = accessor;
    return getSpaceChannels(colorSpace)[offset];
};

const makeChannelObject = <C extends ChannelName>(name: C, accessor: ChannelAccessor): ChannelObjectCS<C> => {
    const [colorSpace, offset] = accessor;
    const maximum = getMaxOrFormula(name);
    return {
        name,
        maximum,
        colorSpace,
        offset,
        accessor
    }
};

export const nameToObject = <C extends ChannelName>(name: C): ChannelObjectCS<C> => {
    const accessor = nameToAccessor(name);
    return makeChannelObject(name, accessor);
};

export const objectToName = <C extends ChannelName>(object: ChannelObjectCS<C>): C => {
    return object.name;
};

export const objectToAccessor = (object: ChannelObjectCS<ChannelName>): ChannelAccessor => {
    //don't have to include accessor as a property, could just store colorSpace and offset
    return object.accessor;
};

//TS will not be able to infer channel name off of accessor
export const accessorToObject = (accessor: ChannelAccessor): ChannelObjectCS<ChannelName> => {
    const name = accessorToName(accessor);
    return makeChannelObject(name, accessor);
};

export const accessorKey = (accessor: ChannelAccessor): string => accessor[0] + "." + accessor[1]; //include a separator so that it can be mapped in reverse

export const keyToAccessor = (key: string): ChannelAccessor => key.split(".") as ChannelAccessor;

/**
 * returns in form "Red (RGB)", "Saturation L (HSL)"
 */
export const accessorTitle = (accessor: ChannelAccessor): string => `${startCase(accessorToName(accessor))} (${accessor[0].toUpperCase()})`;

export const accOrNameToAcc = (channel: ChannelAccessor | ChannelName): ChannelAccessor => {
    //could check for validity, but assuming that it is a valid object of one of the two possibilities based on the TS function param
    return typeof channel === "string" ? nameToAccessor(channel) : channel;
}

export const accOrNameToName = (channel: ChannelAccessor | ChannelName): ChannelName => {
    return typeof channel === "string" ? channel : accessorToName(channel);
}

/**
 * only check that it matches the TS interface, but doesn't check for offset validity
 */
export const isAccessor = (accessor: any): accessor is ChannelAccessor => {
    if ( ! Array.isArray( accessor ) ) {
        return  false;
    }
    const [channel, offset] = accessor;
    return isChannelName(channel) && typeof offset === "number";
}

export const isValidAccessor = (accessor: ChannelAccessor): boolean => {
    const [channel, offset] = accessor;
    const count = channelCount(channel);
    return offset >= 0 && offset < count;
}
