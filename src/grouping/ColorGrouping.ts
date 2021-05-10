import {MatchResult, StoredGroup} from "./types";
import GroupConstraints from "./GroupConstraints";
import {I_ColorAdapter} from "../color/types";
import hexes from "./hexes.json";

export class ColorGrouping {
    public readonly hexes: string[];
    public readonly name: string;
    public readonly definitions: GroupConstraints;

    constructor(data: StoredGroup) {
        this.name = data.name;
        this.hexes = hexes[this.name as keyof typeof hexes] || [];
        this.definitions = new GroupConstraints(data.definitions || []);
    }

    public colorFits(color: I_ColorAdapter, reportAll?: boolean, fuzz?: number): MatchResult {
        return this.definitions.colorFits(color, reportAll, fuzz);
    }
}
