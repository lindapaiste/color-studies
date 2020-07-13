import {ColorPropKey} from "../packages/types";

export interface ColorClassification {
    name: string;
    hexes: string[];
    definitions?: PropertyConstraint[];
}

export interface PropertyConstraint {
    property: ColorPropKey;
    min: number;
    max: number;
}
