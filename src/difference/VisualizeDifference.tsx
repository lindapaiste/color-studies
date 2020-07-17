import React, {useMemo, useState} from "react";
import chroma, {Color} from "chroma-js";
import {range, sortBy} from "lodash";
import {Swatch} from "../sharedComponents/color/Swatch";
import {eitherToString} from "../packages/chroma-js";
import {RenderSet} from "../sharedComponents/color/RenderSet";
import {NumberInput} from "../sharedComponents/form/NumberInput";

export interface Props {
    count?: number;
    color: string | Color;
}

//The parameters L (default 1) and C (default 1) are weighting factors for lightness and chromacity.
export const VisualizeDifference = ({color, count = 300}: Props) => {
    const [lWeight, setLWeight] = useState(1);
    const [cWeight, setCWeight] = useState(1);

    const eWidth = 10;

    const samples = useMemo(
        () => range(0, count).map(() => chroma.random()),
        [color, count]
    );

    const data = useMemo(
        () => {
            const withDiff = samples.map(c => ({
                color: c,
                deltaE: chroma.deltaE(color, c, lWeight, cWeight),
            }));
            const sorted = sortBy(withDiff, o => o.deltaE);
            const chunked: { color: Color, deltaE: number }[][] = [];
            sorted.forEach((o) => {
                const chunkIndex = Math.floor(o.deltaE / eWidth);
                if (Array.isArray(chunked[chunkIndex])) {
                    chunked[chunkIndex].push(o);
                } else {
                    chunked[chunkIndex] = [o];
                }
            });
            return chunked;
        },
        [samples, lWeight, cWeight]
    );


    return (
        <div>
            <h2>Start Color</h2>
            <Swatch color={eitherToString(color)} size={200}/>
            <div>
                <div>Adjust the weighting for properties L (lightness) and C (chroma) in LHC model</div>
                <div>
                    <NumberInput label="L (Lightness)" value={lWeight} onChange={setLWeight} min={0} step={.25}/>
                    <NumberInput label="C (Chroma)" value={cWeight} onChange={setCWeight} min={0} step={.25}/>
                </div>
            </div>
            <div>
                <h2>Randomly-Generated Colors Sorted by DeltaE</h2>
                {data.map((chunk, i) => (
                    <div key={i}>
                        <h3>from {i * eWidth} to {(i + 1) * eWidth}</h3>
                        <RenderSet colors={chunk} colorToString={o => o.color.hex()}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const RandomVisualizeDifference = () => {
    return (
        <VisualizeDifference count={300} color={chroma.random()}/>
    )
};
