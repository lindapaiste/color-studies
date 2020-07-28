import {flatMap, partition, sampleSize, shuffle} from "../lib";
import {allGroups} from "../grouping";

export interface GroupedHex {
    hex: string,
    group: string
}

/**
 * reformats the nested hexes from the groupings data set into an shuffled array
 * where each entry has its hex and the name of the group that it belongs to
 */
export const shuffledHexes = (): GroupedHex[] => {
    return shuffle(flatMap(allGroups(), group => group.hexes.map(hex => ({
        hex,
        group: group.name,
    }))));
};

/**
 * creates a data set based upon a passed in "hexToFeatures" function
 */
export const shuffledGroupData = (hexToFeatures: (hex: string) => number[]): { hex: string, features: number[], group: string }[] => {
    return shuffledHexes().map(({hex, group}) => ({
        hex,
        features: hexToFeatures(hex),
        group,
    }));
};

/**
 * utility function which provides a random sampling of hexes in the specified group
 * and outside of it, with the group name included
 */
export const getSplitSample = (group: string, count: number): [GroupedHex[], GroupedHex[]] => {
    const dataSet = shuffledHexes();
    const [inGroup, notInGroup] = splitInGroup(dataSet, group);
    return [sampleSize(inGroup, count), sampleSize(notInGroup, count)];
};

/**
 * returns two arrays: first is inGroup, second is notInGroup
 */
export const splitInGroup = <T extends { group: string }>(dataSet: T[], group: string): [T[], T[]] => {
    return partition(dataSet, o => o.group === group);
};
