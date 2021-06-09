import { partition, sampleSize, shuffle } from "lib";
import { allGroups, getGroupHexes } from "data";
import { GroupedHex, HasExpected } from "../types";

/**
 * Reformats the nested hexes from the groupings data set into a flat array
 * where each entry has its hex and the name of the group that it belongs to
 */
const groupedHexes: GroupedHex[] = allGroups().flatMap((group) =>
  group.hexes.map((hex) => ({
    hex,
    group: group.name,
  }))
);

/**
 * Shuffles the grouped hexes into random order.
 */
export const shuffledHexes = (): GroupedHex[] => shuffle(groupedHexes);

/**
 * Get a random sampling of grouped hexes.
 */
export const sampleHexes = (count: number): GroupedHex[] =>
  sampleSize(groupedHexes, count);

/**
 * creates a data set based upon a passed in "hexToFeatures" function
 */
export const shuffledGroupData = (
  hexToFeatures: (hex: string) => number[]
): { hex: string; features: number[]; group: string }[] =>
  shuffledHexes().map(({ hex, group }) => ({
    hex,
    features: hexToFeatures(hex),
    group,
  }));

/**
 * returns two arrays: first is inGroup, second is notInGroup
 */
export const splitInGroup = <T extends { group: string }>(
  dataSet: T[],
  group: string
): [T[], T[]] => partition(dataSet, (o) => o.group === group);

/**
 * utility function which provides a random sampling of hexes in the specified group
 * and outside of it, with the group name included
 */
export const getSplitSample = (
  group: string,
  count: number
): [GroupedHex[], GroupedHex[]] => {
  const dataSet = shuffledHexes();
  const [inGroup, notInGroup] = splitInGroup(dataSet, group);
  return [sampleSize(inGroup, count), sampleSize(notInGroup, count)];
};

/**
 * half are from the group, and half are from any other group
 */
export const getBalancedSample = (
  group: string,
  totalCount: number
): Array<GroupedHex & HasExpected> => {
  const countPer = Math.ceil(totalCount / 2);
  const dataSet = shuffledHexes();
  const [inGroup, notInGroup] = splitInGroup(dataSet, group);
  return shuffle([
    ...sampleSize(inGroup, countPer).map((obj) => ({
      ...obj,
      expected: true,
    })),
    ...sampleSize(notInGroup, countPer).map((obj) => ({
      ...obj,
      expected: false,
    })),
  ]);
};

export const sampleGroupHexes = (group: string, count: number): string[] =>
  sampleSize(getGroupHexes(group), count);

export const sampleNonGroupHexes = (group: string, count: number): string[] => {
  const hexes = allGroups().flatMap((g) => (g.name === group ? [] : g.hexes));
  return sampleSize(hexes, count);
};
