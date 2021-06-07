import { getGroupHexes, NameAndHexes } from "data";
import { MatchResult } from "./types";
import { GroupConstraints } from "./GroupConstraints";
import { IColorAdapter } from "../../color/types";
import { StoredGroup } from "./constraint-data";

/**
 * Grouping object combines name, hex array, and constraints.
 * Can validate if a color fits into the defined constraints.
 */
export class ColorGrouping implements NameAndHexes {
  public readonly hexes: string[];

  public readonly name: string;

  public readonly definitions: GroupConstraints;

  constructor(data: StoredGroup) {
    this.name = data.name;
    this.hexes = getGroupHexes(data.name);
    this.definitions = new GroupConstraints(data.definitions || []);
  }

  public colorFits(
    color: IColorAdapter,
    reportAll?: boolean,
    fuzz?: number
  ): MatchResult {
    return this.definitions.colorFits(color, reportAll, fuzz);
  }
}
