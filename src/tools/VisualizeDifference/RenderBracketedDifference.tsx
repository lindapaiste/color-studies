import React, { ReactNode, useMemo } from "react";
import { round, sortBy } from "lib";
import { ColorSet, Title } from "components";
import { ColorAdapter } from "logic";

/**
 * data must include color and deltaE, but can also include a tooltip
 */
export interface DataPoint {
  color: ColorAdapter;
  deltaE: number;
  tooltip?: ReactNode;
}

export interface Props {
  chunkWidth?: number;
  data: DataPoint[];
}

export const RenderBracketedDifference = ({ data, chunkWidth = 10 }: Props) => {
  const chunks = useMemo(() => {
    const sorted = sortBy(data, (o) => o.deltaE);
    const chunked: DataPoint[][] = [];
    sorted.forEach((o) => {
      const chunkIndex = Math.floor(o.deltaE / chunkWidth);
      if (Array.isArray(chunked[chunkIndex])) {
        chunked[chunkIndex].push(o);
      } else {
        chunked[chunkIndex] = [o];
      }
    });
    return chunked;
  }, [data, chunkWidth]);
  return (
    <div>
      {chunks.map((chunk, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i}>
          <Title importance="h3">
            from {i * chunkWidth} to {(i + 1) * chunkWidth}
          </Title>
          <ColorSet
            colors={chunk}
            colorToHex={(o: DataPoint) => o.color.hex()}
            colorToTooltip={(o: DataPoint) => o.tooltip || round(o.deltaE, 2)}
          />
        </div>
      ))}
    </div>
  );
};
