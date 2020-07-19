import React, {ReactNode, useMemo} from "react";
import {round, sortBy} from "lodash";
import {Swatch} from "../sharedComponents/color/Swatch";
import {RenderSet} from "../sharedComponents/color/RenderSet";
import {usePartialState} from "../util-hooks";
import {FormulaSettings} from "./types";
import {I_ColorAdapter, randomColor} from "../packages/color-adapter";
import {DifferenceControls} from "./DifferenceControls";
import {makeArray} from "../util";
import {Calculation} from "./Calculation";
import {Formula} from "./Formula";

export interface Props {
    count?: number;
    color: I_ColorAdapter;
}

export const VisualizeDifference = ({color, count = 300}: Props) => {
    const [state, update] = usePartialState<Required<FormulaSettings>>({
        algo: "CIE2000",
        model: "lch",
        weights: [1, 1, 1, 1]
    });

    const formula = useMemo(
        () => new Formula(state), [
            state.model,
            state.algo,
            state.weights
        ]);

    const samples = useMemo(() => makeArray(count, randomColor), [color, count]);

    const data = useMemo(() => {
        return samples.map(c => {
            const calc = new Calculation(formula, c, color);
            return ({
                color: c,
                deltaE: calc.deltaE,
                tooltip: calc.tooltip,
            })
        });
    }, [samples, formula])

    return (
        <div>
            <h2>Start Color</h2>
            <Swatch color={color} size={200}/>
            <div>
                <div>Adjust the parameters for calculating difference</div>
                <DifferenceControls state={state} update={update}/>
            </div>
            <div>
                <h2>Randomly-Generated Colors Sorted by DeltaE</h2>
                <RenderBracketedDifference data={data}/>
            </div>
        </div>
    );
};

/**
 * data must include color and deltaE, but can also include a tooltip
 */
export interface DataPoint {
    color: I_ColorAdapter;
    deltaE: number;
    tooltip?: ReactNode;
}

export interface RGDProps<T extends DataPoint> {
    chunkWidth?: number;
    data: DataPoint[];
}

export const RenderBracketedDifference = <T extends DataPoint>({data, chunkWidth = 10}: RGDProps<T>) => {
    const chunks = useMemo(() => {
            const sorted = sortBy(data, o => o.deltaE);
            const chunked: DataPoint[][] = [];
            sorted.forEach(o => {
                const chunkIndex = Math.floor(o.deltaE / chunkWidth);
                if (Array.isArray(chunked[chunkIndex])) {
                    chunked[chunkIndex].push(o);
                } else {
                    chunked[chunkIndex] = [o];
                }
            });
            return chunked;
        }, [data, chunkWidth]
    );
    return (
        <div>
            {chunks.map((chunk, i) => (
                <div key={i}>
                    <h3>
                        from {i * chunkWidth} to {(i + 1) * chunkWidth}
                    </h3>
                    <RenderSet
                        colors={chunk}
                        colorToString={o => o.color.hex()}
                        colorToTooltip={o => o.tooltip || round(o.deltaE, 2)}
                    />
                </div>
            ))}
        </div>
    );
}

export const RandomVisualizeDifference = () => {
    return <VisualizeDifference count={300} color={randomColor()}/>;
};
