import React, {ReactNode, useMemo} from "react";
import {round, sortBy} from "../../lib";
import {Title} from "../../sharedComponents/ui/Title";
import {RenderSet} from "../../sharedComponents/color/RenderSet";
import {I_ColorAdapter} from "../../color/types";

/**
 * data must include color and deltaE, but can also include a tooltip
 */
export interface DataPoint {
    color: I_ColorAdapter;
    deltaE: number;
    tooltip?: ReactNode;
}

export interface Props<T extends DataPoint> {
    chunkWidth?: number;
    data: DataPoint[];
}

export const RenderBracketedDifference = <T extends DataPoint>({data, chunkWidth = 10}: Props<T>) => {
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
                    <Title importance={"h3"}>
                        from {i * chunkWidth} to {(i + 1) * chunkWidth}
                    </Title>
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
