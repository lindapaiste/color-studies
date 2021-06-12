import React, { useMemo } from "react";
import { ColorAdapter } from "logic/color/ColorAdapter";
import { ColorSpaceName, ColorTuple } from "logic/spacesChannels/types";
import { flatMap, intervals, replaceIndex } from "lib";
import { ModelAdapter } from "logic/spacesChannels/ModelAdapter";
import { ColorSet, TupleTooltip } from "components";

/**
 * a visual representation of the contents of a colorspace
 *
 * might be easier to see if the bands of channel lined up
 */

export interface Props {
  /**
   * The model to use
   */
  model: ModelAdapter<ColorSpaceName>;
  /**
   * The total count of samples to include.
   * Subject to rounding based on the cube root.
   */
  totalCount: number;
  /**
   * The number of colors to display per row.
   */
  perRow: number;
  /**
   * The total width of the grid.
   */
  width: number;
}

/**
 * Generate all of the colors in a colorspace such that they fill the
 */
export const allSpaceTuples = <CS extends ColorSpaceName>(
  model: ModelAdapter<CS>,
  totalCount: number
): ColorTuple<CS>[] => {
  // initialize array with one entry, then map through multiplying by channel
  let tuples = [model.makeTuple(1)];

  // intervalCount is the count of points per channel
  // take the nth root of the desired total
  // must be a whole number as this is the length of an array
  const intervalCount = Math.round(totalCount ** (1 / model.channelCount));

  for (let i = 0; i < model.channelCount; i++) {
    tuples = flatMap(tuples, (tuple) =>
      intervals(0, 1, intervalCount).map((value) =>
        replaceIndex(tuple, i, value)
      )
    );
  }
  return tuples;
};

export const ModelPalette = ({ model, totalCount, perRow, width }: Props) => {
  const colors = useMemo(() => {
    const tuples = allSpaceTuples(model, totalCount);
    // map normalized tuples into hexes, also including a tooltip element
    return tuples.map((tuple) => {
      const deNormalized = model.deNormalize(tuple);
      return {
        hex: ColorAdapter.staticFrom(deNormalized, model.name).hex(),
        tooltip: <TupleTooltip model={model} deNormalized={deNormalized} />,
      };
    });
  }, [model, totalCount]);

  return (
    <div style={{ width: "100%" }}>
      <ColorSet
        colors={colors}
        colorToTooltip={(c) => c.tooltip}
        colorToHex={(c) => c.hex}
        wrap
        // is used as both the height and width of each cell
        height={width / perRow}
      />
    </div>
  );
};
