import { ColorGrouping } from "./ColorGrouping";
import { GROUPINGS } from "./constraint-data";

export const KEYED_GROUPS: Record<string, ColorGrouping> = Object.fromEntries(
  GROUPINGS.map((group) => [group.name, new ColorGrouping(group)])
);
export const getColorGrouping = (name: string): ColorGrouping =>
  KEYED_GROUPS[name];
