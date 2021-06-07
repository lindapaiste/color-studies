import { sample } from "lib";
import HEXES from "./groups/hexes.json";

/**
 * Most basic representation of a group object
 */
export interface NameAndHexes {
  name: string;
  hexes: string[];
}

const ALL_GROUP_OBJECTS = Object.entries(HEXES).map(([name, hexes]) => ({
  name,
  hexes,
}));
export const allGroups = (): NameAndHexes[] => ALL_GROUP_OBJECTS;

export const allGroupNames = (): string[] => Object.keys(HEXES);

export const getGroupHexes = (name: string): string[] => {
  return (HEXES as Record<string, string[]>)[name] ?? [];
};

export const randomGroupName = (): string => sample(allGroupNames()) as string;
