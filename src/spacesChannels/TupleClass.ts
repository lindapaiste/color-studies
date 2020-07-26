import {ChannelCount, ColorSpaceName, ColorTuple, TupleShared} from "./types";
import {ModelAdapter} from "./ModelAdapter";
import {eitherToModel, ModelOrName} from "./models";
import {isUndefined, round, tupleMap} from "../lib";

export interface I_TupleClass<CS extends ColorSpaceName> {
    model: ModelAdapter<CS>;
    normalized: ColorTuple<CS>;
    deNormalized: ColorTuple<CS>;
    rounded: ColorTuple<CS>;
}

/**
 * give it some methods so that it can act like an array
 */
export class TupleClass<CS extends ColorSpaceName> implements I_TupleClass<CS>, ArrayLike<number> {

    public normalized: ColorTuple<CS>;
    public model: ModelAdapter<CS>;
    private _deNormalized?: ColorTuple<CS>

    constructor(values: ColorTuple<CS>, model: ModelOrName<CS>, normalized: boolean) {
        //doesn't matter which format I store in, but one of the two should always be defined
        this.model = eitherToModel(model);
        this.normalized = normalized ? values : this.model.normalize(values);
        //save deNormalized if it was passed, but don't compute otherwise
        this._deNormalized = normalized ? undefined : values;
    }

    get deNormalized(): ColorTuple<CS> {
        if (isUndefined(this._deNormalized)) {
            this._deNormalized = this.model.deNormalize(this.normalized)
        }
        return this._deNormalized;
    }

    //is the denormalized because rounding makes no sense from 0 to 1
    get rounded(): ColorTuple<CS> {
        return tupleMap(this.deNormalized, round);
    }

    /**
     * gets either the normalized or the denormalized based on the value of a boolean prop
     */
    public getEither(normalized: boolean): ColorTuple<CS> {
        return normalized ? this.normalized : this.deNormalized;
    }

    get length(): number {
        return this.normalized.length;
    }

    /**
     * index signature to implement ArrayLike
     * saying that it always returns a number because the complex version isn't read properly
     * get0() takes the type of 0 as number rather than 0
     *
     * could also access underlying array using a JS Proxy object
     * https://stackoverflow.com/questions/7891937/is-it-possible-to-implement-dynamic-getters-setters-in-javascript
     */
    //[i: number]: typeof i extends 0 | 1 | 2 ? number : typeof i extends 3 ? ChannelCount<CS> extends 4 ? number : undefined : undefined;
    [i: number]: number;

    get 0() {
        return this.normalized[0];
    }

    get 1() {
        return this.normalized[1];
    }

    get 2() {
        return this.normalized[2];
    }

    get 3() {
        return this.normalized[3] as number;
    }
}

export default TupleClass;
