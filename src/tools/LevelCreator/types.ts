import {Levers} from "../../boxSets/types";
import {I_FormulaClass} from "../../difference/types";
import {I_ModelNoise} from "../../noise/types";
import {ChannelAccessor} from "../../spacesChannels/types";
import {ChannelAdapter} from "../../spacesChannels/ChannelAdapter";

export interface Identifier {
    boxIndex: number;
    ballIndex: number;
}

/**
 * is basically BallCreateSettings but with noise and distance as objects rather than formulas
 */
export interface AdvancedSettings extends Levers {
    formula: I_FormulaClass;
    noise: I_ModelNoise;
    count: number;
}

/**
 * rather than updating the start and end based on the min/max of the channel,
 * define this interface such that start and end are RELATIVE numbers between 0 and 1
 */
export interface ShiftSettings {
    channel: ChannelAdapter;
    start: number;
    end: number;
}

export interface BallDisplaySettings {
    shuffle: boolean;
    darkBackground: boolean;
    showTools: boolean;
    showRejected: boolean;
}
