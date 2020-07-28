import GROUPINGS from "./raw-data";
import {ColorGrouping} from "./ColorGrouping";
import {typedKeys, typedValues, sample} from "../lib";

const KEYED_GROUPS: Record<string, ColorGrouping> = Object.fromEntries(GROUPINGS.map(group => [group.name, new ColorGrouping(group)]));

export const allGroupNames = (): string[] => typedKeys(KEYED_GROUPS);

export const allGroups = (): ColorGrouping[] => typedValues(KEYED_GROUPS);

export const getGroup = (name: string): ColorGrouping | undefined => {
    return KEYED_GROUPS[name];
};

export const getGroupHexes = (name: string): string[] => {
    const group = getGroup(name);
    return group ? group.hexes : [];
}

/**
 * forms can use a random group as the start point rather than always starting with the first
 */
export const randomGroup = (): ColorGrouping => <ColorGrouping>sample(KEYED_GROUPS);
