import {TransformPair} from "./transforms";
import {ColorAdapter, I_ColorAdapter} from "../packages/ColorAdapter";
import {ModelAdapter} from "../spacesChannels/ModelAdapter";
import {ChannelCountTuple, ColorSpaceName, ColorTuple} from "../spacesChannels/types";
import {TupleClass} from "../spacesChannels/TupleClass";
import {ModelTransform} from "./ModelTransform";
import {intervals, makeArray} from "../lib";
import {I_Gradient} from "./types";

export interface Props<CS extends ColorSpaceName> {
    start: I_ColorAdapter;
    end: I_ColorAdapter;
    model: ModelAdapter<CS>;
    transform?: boolean | ChannelCountTuple<CS, boolean | TransformPair>;
}

/**
 * gradient always uses normalized?
 *
 * values are linearly separated,
 * but can use a pre and post transform to change that spacing
 * for example, want spaced based on x-squared value for RGB
 */
export class ModelGradient <CS extends ColorSpaceName> implements I_Gradient {
    private readonly start: TupleClass<CS>;
    private readonly end: TupleClass<CS>;
    private readonly transform: ModelTransform<CS>;
    public readonly model: ModelAdapter<CS>;

    constructor({start, end, model, transform = false}: Props<CS>) {
        this.model = model;
        //transform class fills in the gaps from transform prop
        this.transform = new ModelTransform({model, transform, normalized: true});
        //internally stored start and end are already transformed
        this.start = this.transform.applyPre(start.toClassed(model));
        this.end = this.transform.applyPre(end.toClassed(model));
    }

    public colors( count: number ): I_ColorAdapter[] {
        //get 3 (or 4) vectors with the values of the channel
        const vectors = this.model.channels.map(
            (channel, i) => intervals(this.start[i], this.end[i], count)
        );
        //make a color object from an index of the vectors
        const colorI = (i: number): I_ColorAdapter => {
            const values = vectors.map( array => array[i] ) as ColorTuple<CS>;
            //post-transform each value
            const tuple = this.transform.applyPost( new TupleClass(values, this.model, true) );
            return ColorAdapter.fromTuple(tuple);
        }
        return makeArray(count, colorI);
    }
}
