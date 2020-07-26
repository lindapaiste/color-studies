import {ChannelCountTuple, ColorSpaceName, ColorTuple} from "./types";
import {ChannelAdapter} from "./ChannelAdapter";
import {COLOR_SPACE_ARRAYS} from "./colorSpaces";
import {makeArray, tupleMap} from "../lib";

export class ModelAdapter<CS extends ColorSpaceName> {
    public readonly name: CS;
    public readonly channels: ChannelAdapter[];

    /**
     * stores channels as ChannelAdapter objects
     */
    constructor(name: CS) {
        this.name = name;
        const channelNames = COLOR_SPACE_ARRAYS[name];
        this.channels = channelNames.map(
            channel => ChannelAdapter.fromName(channel, name)
        );
    }

    get channelCount(): number {
        return this.channels.length;
    }

    get key(): string {
        return this.name;
    }

    /**
     * title is the name in uppercase, aka "RGB", "HSL"
     */
    get title(): string {
        return this.name.toUpperCase();
    }

    /**
     * makes an array of the right length (3 or 4) for the color space
     * mainly needed for typescript knowledge of the array length, as makeArray returns number[]
     * is usually numbers, but can make a tuple of another type too
     */
    public makeTuple <T = number > (value: T | ((i: number) => T)): ChannelCountTuple<CS, T> {
        return makeArray(this.channelCount, value) as ChannelCountTuple<CS, T>;
    }

    /**
     * checks that the length of the array is enough for the color space
     * can include extra entries -- assumes that these will be ignored
     */
    public isValidTuple(array: number[]): array is ColorTuple<CS> {
        return array.length >= this.channelCount;
    }

    /**
     * normalizes a tuple from channel-specific ranges to 0-1 range
     * ie. [180, 50, 0] in HSL to [.5, .5, 0]
     */
    public normalize(tuple: ColorTuple<CS>): ColorTuple<CS> {
        return tupleMap(tuple, (value, i) => this.channels[i].normalize(value) )
    }

    /**
     * converts a normalized tuple from 0-1 range back into channel-specific range
     * ie. [.5, .5, 0] in HSL to [180, 50, 0]
     */
    public deNormalize(tuple: ColorTuple<CS>): ColorTuple<CS> {
        return tupleMap(tuple, (value, i) => this.channels[i].deNormalize(value) )
    }
}

