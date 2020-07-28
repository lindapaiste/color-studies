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

    /**
     * construct a TupleClass object from an array of numeric values
     * need to know what model these numbers describe and whether or not they are normalized
     */
    constructor(values: ColorTuple<CS>, model: ModelOrName<CS>, normalized: boolean) {
        //doesn't matter which format I store in, but one of the two should always be defined
        this.model = eitherToModel(model);
        this.normalized = normalized ? values : this.model.normalize(values);
        //save deNormalized if it was passed, but don't compute otherwise
        this._deNormalized = normalized ? undefined : values;
    }

    /**
     * gets the tuple in the colorspace's standard range, ie. 0-255, 0-100, etc.
     */
    get deNormalized(): ColorTuple<CS> {
        if (isUndefined(this._deNormalized)) {
            this._deNormalized = this.model.deNormalize(this.normalized)
        }
        return this._deNormalized;
    }

    /**
     * rounded version is the denormalized because rounding makes no sense from 0 to 1
     */
    get rounded(): ColorTuple<CS> {
        return tupleMap(this.deNormalized, round);
    }

    /**
     * gets either the normalized or the denormalized based on the value of a boolean prop
     * will round to the desired precision, or return raw if precision is not set
     */
    public getEither(normalized: boolean, precision?: number ): ColorTuple<CS> {
        const raw = normalized ? this.normalized : this.deNormalized;
        //can't just do precision ? because 0 is a valid value
        return precision !== undefined ? tupleMap( raw, v => round(v, precision) ) : raw;
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

    get length(): number {
        return this.normalized.length;
    }

    /**
     * want to have a map method, but unsure whether to use normalized or deNormalized
     * don't want to have an additional parameter for flagging that because then
     * map() wouldn't match the signature or an array map
     */
}

export default TupleClass;
