import React, { FunctionComponent, useMemo, useState } from "react";
import { makeArray } from "lib";
import { SelectColor, Title, DeltaETooltip } from "components";
import { usePartialState } from "lib/usePartialState";
import { randomColor } from "logic";
import { FormulaSettings } from "logic/difference/types";
import { Calculation } from "logic/difference/Calculation";
import { Formula } from "logic/difference/Formula";
import {
  DataPoint,
  RenderBracketedDifference,
} from "./RenderBracketedDifference";
import { DifferenceControls } from "../DistanceGrid/DifferenceControls";

export interface Props {
  count?: number;
}

export const VisualizeDifference: FunctionComponent<Props> = ({
  count = 300,
}) => {
  const [color, setColor] = useState(randomColor);

  const [state, update] = usePartialState<Required<FormulaSettings>>({
    algo: "CIE2000",
    model: "lch",
    weights: [1, 1, 1, 1],
  });

  const formula = useMemo(() => new Formula(state), [state]);

  const samples = useMemo(() => makeArray(count, randomColor), [count]);

  const data: DataPoint[] = useMemo(
    () =>
      samples.map((c) => {
        const calc = new Calculation(formula, c, color);
        return {
          color: c,
          deltaE: calc.deltaE,
          tooltip: DeltaETooltip(calc),
        };
      }),
    [samples, formula, color]
  );

  return (
    <div>
      <div>
        <SelectColor
          label="Start Color"
          value={color}
          onChange={setColor}
          width={300}
          height={100}
          randomize
        />
        <div>Adjust the parameters for calculating difference</div>
        <DifferenceControls state={state} update={update} />
      </div>
      <div>
        <Title>Randomly-Generated Colors Sorted by DeltaE</Title>
        <RenderBracketedDifference data={data} />
      </div>
    </div>
  );
};
