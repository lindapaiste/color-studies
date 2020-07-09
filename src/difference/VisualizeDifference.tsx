import React, {useMemo} from "react";
import chroma, {Color} from "chroma-js";
import {useNumberInput} from "../toolComponents/useNumberInput";
import {range, sortBy} from "lodash";
import {Swatch} from "../Swatch";
import {chromaString} from "../properties/chroma-js";
import {RenderSet} from "../RenderSet";

export interface Props {
    count: number;
    color: string | Color;
}

//The parameters L (default 1) and C (default 1) are weighting factors for lightness and chromacity.
export const VisualizeDifference = ({color, count}: Props) => {
    const [lWeight, LWeightInput] = useNumberInput(1);
    const [cWeight, CWeightInput] = useNumberInput(1);

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
            const chunked: {color: Color, deltaE: number}[][] = [];
            sorted.forEach((o) => {
               const chunkIndex = Math.floor(o.deltaE / eWidth);
               if ( Array.isArray(chunked[chunkIndex]) ) {
                   chunked[chunkIndex].push( o );
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
            <Swatch color={chromaString(color)} size={200}/>
            <LWeightInput/>
            <CWeightInput/>
            <div>
                {data.map( (chunk, i) => (
                    <div key={i}>
                        <h3>from {i * eWidth} to {(i + 1) * eWidth}</h3>
                        <RenderSet colors={chunk} colorToString={o => o.color.hex()}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DefaultVisualizeDifference = () => {
    return (
        <VisualizeDifference count={300} color={chroma.random()}/>
    )
};
