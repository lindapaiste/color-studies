import {MatchResult, PropertyDef, StoredGroup} from "./types";
import {getChannel} from "../spacesChannels/channels";
import GroupConstraints from "./GroupConstraints";
import {I_ColorAdapter} from "../color/types";

export class ColorGrouping {
    public readonly hexes: string[];
    public readonly name: string;
    public readonly definitions: GroupConstraints;

    constructor(data: StoredGroup) {
        this.hexes = data.hexes;
        this.name = data.name;
        this.definitions = new GroupConstraints(data.definitions || []);
    }

    public colorFits(color: I_ColorAdapter, reportAll?: boolean, fuzz?: number): MatchResult {
        return this.definitions.colorFits(color, reportAll, fuzz);
    }
}
