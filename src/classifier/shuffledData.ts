import {flatMap, omitBy, partition, sampleSize, shuffle} from "../lib";
import {allGroups, getGroup} from "../grouping";
import {GroupedHex, I_Expected} from "./types";

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
 * half are from the group, and half are from any other group
 */
export const getBalancedSample = (group: string, totalCount: number): Array<GroupedHex & I_Expected> => {
    const countPer = Math.ceil(totalCount/2);
    const dataSet = shuffledHexes();
    const [inGroup, notInGroup] = splitInGroup(dataSet, group);
    return shuffle([
        ...sampleSize(inGroup, countPer).map( obj => ({
            ...obj,
            expected: true,
        })),
        ...sampleSize(notInGroup, countPer).map( obj => ({
            ...obj,
            expected: false,
        }))
    ]);
}

export const sampleGroupHexes = (group: string, count: number): string[] => {
    return sampleSize(getGroup(group)?.hexes, count);
}

export const sampleNonGroupHexes = (group: string, count: number): string[] => {
    const hexes = flatMap(omitBy(allGroups(), g => g.name === group), g => g.hexes);
    return sampleSize( hexes, count);
}

/**
 * returns two arrays: first is inGroup, second is notInGroup
 */
export const splitInGroup = <T extends { group: string }>(dataSet: T[], group: string): [T[], T[]] => {
    return partition(dataSet, o => o.group === group);
};
