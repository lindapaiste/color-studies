import {PerceptronModel} from "simple-statistics"
import GROUPINGS from "../grouping/group-data";
import chroma, {Color} from "chroma-js";
import {util} from "../properties/chroma-js";

/**
 * use all properties of a color to build the model
 *
 * use manually defined color groups as the training data to create a model which assigns group
 */
export const buildIsGroupModel = (groupIndex: number): PerceptronModel => {
    const model = new PerceptronModel();
    for ( let i = 0; i < GROUPINGS.length; i++ ) {
        const hexes = GROUPINGS[i].hexes;
        const expected = i === groupIndex ? 1 : 0;
        hexes.forEach( hex => {
            model.train( toData( chroma(hex) ), expected );
        });
    }
    return model;
};

export const toData = (color: Color) => Object.values( util.getProfile( color ) );
