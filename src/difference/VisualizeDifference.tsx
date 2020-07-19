import React, {useCallback, useMemo} from "react";
import {sortBy} from "lodash";
import {Swatch} from "../sharedComponents/color/Swatch";
import {RenderSet} from "../sharedComponents/color/RenderSet";
import {usePartialState} from "../util-hooks";
import {BasicFormula, FormulaSettings} from "./types";
import {toFormula} from "./distance";
import {I_ColorAdapter, randomColor} from "../packages/color-adapter";
import {DifferenceControls} from "./DifferenceControls";
import {makeArray} from "../util";

export interface Props {
    count?: number;
    color: I_ColorAdapter;
}

export const VisualizeDifference = ({color, count = 300}: Props) => {
    const [state, update] = usePartialState<Required<FormulaSettings>>({
        algo: 'CIE2000',
        model: 'lch',
        weights: [1, 1, 1, 1]
    })

    const getDistance = useCallback(
        toFormula(state),
        [state.model, state.algo, state.weights]
    );

    const samples = useMemo(
        () => makeArray(count, randomColor),
        [color, count]
    );

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
                <SortedColors base={color} colors={samples} getDistance={getDistance}/>
            </div>
        </div>
    );
};

export const SortedColors = ({base, colors, getDistance, chunkWidth = 10}: { base: I_ColorAdapter, colors: I_ColorAdapter[], getDistance: BasicFormula, chunkWidth?: number }) => {
    const data = useMemo(
        () => {
            const withDiff = colors.map(c => ({
                color: c,
                deltaE: getDistance(c, base),
            }));
            const sorted = sortBy(withDiff, o => o.deltaE);
            const chunked: { color: I_ColorAdapter, deltaE: number }[][] = [];
            sorted.forEach((o) => {
                const chunkIndex = Math.floor(o.deltaE / chunkWidth);
                if (Array.isArray(chunked[chunkIndex])) {
                    chunked[chunkIndex].push(o);
                } else {
                    chunked[chunkIndex] = [o];
                }
            });
            return chunked;
        },
        [colors, getDistance, chunkWidth]
    );

    return (
        <div>
            {data.map((chunk, i) => (
                <div key={i}>
                    <h3>from {i * chunkWidth} to {(i + 1) * chunkWidth}</h3>
                    <RenderSet colors={chunk} colorToString={o => o.color.hex()}/>
                </div>
            ))}
        </div>
    )
}

export const RandomVisualizeDifference = () => {
    return (
        <VisualizeDifference count={300} color={randomColor()}/>
    )
};
