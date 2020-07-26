import {allModels} from "./models";
import {flatMap, sortBy} from "../lib";
import {ChannelAdapter} from "./ChannelAdapter";
import {ChannelAccessor} from "./types";

/**
 * array of all channel objects, sorted by name
 */
export const ALL_CHANNELS: ChannelAdapter[] = sortBy( flatMap(allModels(), m => m.channels), c => c.name );

/**
 * a function makes things more flexible BUT don't need to re-sort or re-map every time it is called
 */
export const allChannels = () => ALL_CHANNELS;

/**
 * object of channels keyed by channel key for easy lookup
 */
const KEYED_CHANNELS = Object.fromEntries( allChannels().map( channel => [channel.key, channel] ) );

/**
 * externalize creation of classes so that they don't need to be created more than once
 */
export const getChannel = (channel: ChannelAccessor): ChannelAdapter => {
    return new ChannelAdapter(channel);
}

/**
 * assumes that the key is valid
 */
export const getChannelFromKey = (key: string): ChannelAdapter => {
    return KEYED_CHANNELS[key];
    //alternatively, return allChannels().find( channel => channel.key === key )
}

/**
 * helper so that ColorAdapter and other can accept channel in multiple forms
 */
export const eitherToAccessor = (channel: ChannelAdapter | ChannelAccessor): ChannelAccessor => {
    return Array.isArray(channel) ? channel : channel.accessor;
}

export const eitherToObject = (channel: ChannelAdapter | ChannelAccessor): ChannelAdapter => {
    return Array.isArray(channel) ? getChannel(channel) : channel;
}
