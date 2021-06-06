import React, { useMemo } from "react";
import { ColorAdapter } from "../../color/ColorAdapter";
import { ColorSpaceName, ColorTuple } from "../../spacesChannels/types";
import { flatMap, intervals, replaceIndex } from "../../lib";
import { ModelAdapter } from "../../spacesChannels/ModelAdapter";
import { RenderSet } from "../../sharedComponents/color/RenderSet";
import useDimensions from "../../lib/useDimensions";
import { TupleTooltip } from "../../sharedComponents/color/TupleTooltip";

/**
 * a visual representation of the contents of a colorspace
 *
 * might be easier to see if the bands of channel lined up
 */

export interface Props {
  model: ModelAdapter<ColorSpaceName>;
  totalCount?: number;
  perRow?: number;
}

export const allSpaceTuples = <CS extends ColorSpaceName>(
  model: ModelAdapter<CS>,
  totalCount: number
): ColorTuple<CS>[] => {
  // initialize array with one entry, then map through multiplying by channel
  let tuples = [model.makeTuple(1)];

  // intervalCount is the count of points per channel
  // take the nth root of the desired total
  // must be a whole number as this is the length of an array
  const intervalCount = Math.round(
    totalCount ** (1 / model.channelCount)
  );

  for (let i = 0; i < model.channelCount; i++) {
    tuples = flatMap(tuples, (tuple) =>
      intervals(0, 1, intervalCount).map((value) =>
        replaceIndex(tuple, i, value)
      )
    );
  }
  return tuples;
};

export const ModelPalette = ({
  model,
  totalCount = 1000,
  perRow = 50,
}: Props) => {
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

  const [ref, container] = useDimensions();

  const { width = 500 } = container;

  const size = width / perRow;

  return (
    <div ref={ref} style={{ width: "100%" }}>
      <RenderSet
        colors={colors}
        colorToTooltip={(c) => c.tooltip}
        colorToString={(c) => c.hex}
        wrap
        height={size}
      />
    </div>
  );
};

export default ModelPalette;
