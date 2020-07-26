import {ChannelAccessor, ChannelMaxObject, ChannelName, ColorSpaceName} from "./types";
import {accessorKey, accessorTitle, accessorToName, nameToAccessor} from "./accessorConversion";
import {_getMaxPartialObject} from "./channelMaxes";
import {getSpaceChannelNames} from "./colorSpaces";
import {getModel} from "./models";

/**
 * one Channel object per channel name / color space pairing
 * channels appearing in multiple color spaces will need multiple classes
 *
 *
 * wanting to minimize the use of conversion functions through OOP approach
 */

export class ChannelAdapter implements Required<ChannelMaxObject> {
    public readonly modelName: ColorSpaceName;
    public readonly offset: number;
    public readonly name: ChannelName;
    public readonly max: number;
    public readonly min: number;
    public readonly isLooped: boolean;
    public readonly isVariable: boolean;

    constructor(accessor: ChannelAccessor) {
        this.modelName = accessor[0];
        this.offset = accessor[1];
        this.name = accessorToName(accessor);
        const maxes = _getMaxPartialObject(this.name);
        this.max = maxes.max;
        this.min = maxes.min || 0;
        this.isLooped = maxes.isLooped || false;
        this.isVariable = maxes.isVariable || false;
    }

    /**
     * can construct from name, but also need to know the color space
     * can fallback to the first possible color space when there are multiple
     */
    public static fromName(name: ChannelName, model?: ColorSpaceName): ChannelAdapter {
        if (model === undefined) {
            return new ChannelAdapter(nameToAccessor(name));
        }
        const channels = getSpaceChannelNames(model);
        const offset = channels.indexOf(name);
        if (offset == -1) {
            throw new Error(`channel ${name} not found in color space ${model}, which has channels ${channels.join(", ")}`)
        }
        return new ChannelAdapter([model, offset]);
    }

    get accessor(): ChannelAccessor {
        return [this.modelName, this.offset];
    }

    /**
     * stringified version of the accessor, ie. "hsl.0"
     */
    get key(): string {
        return accessorKey(this.accessor);
    }

    /**
     * gets in the form of "hsl.l", "rgb.r", etc.
     * previously stored the channels with letter keys,
     * but now relying on the assumption that the color space name matches the channel letters
     */
    get slug(): string {
        const letter = this.modelName[this.offset];
        return this.modelName + '.' + letter;
    }

    /**
     * returns in form "Red (RGB)", "Saturation (HSL)"
     * drops off second word which is always for disambiguation and is redundant when the colorspace is included
     */
    get title(): string {
        return accessorTitle(this.accessor);
    }

    /**
     * the width of the colorspace.  will be equal to max unless min is negative
     */
    get range(): number {
        return this.max - this.min;
    }

    /**
     * transforms into a number from 0 to 1
     * where 0 and 1 are the total min and max for the channel (not the limits for this color)
     */
    public normalize(value: number): number {
        return (value - this.min) / this.range;
    }

    /**
     * transforms a normalized number from 0 to 1
     * back into an actual channel value (ie. 0-360, 0-100, etc.)
     */
    public deNormalize(value: number): number {
        return value * (this.range) + this.min;
    }

    get modelObject() {
        return getModel(this.modelName);
    }

    /**
     * validate a value to the channel
     */
    public isValid(value: number): boolean {
        return value >= this.min && value <= this.max;
    }

}

export default ChannelAdapter;
