import React from "react";
import { round } from "lodash";
import { ColorSpaceName, ColorTuple } from "logic/colorspaces/types";
import { ModelAdapter } from "logic/colorspaces/ModelAdapter";
import { eitherToModel } from "logic/colorspaces/models";
import { ColorAdapter } from "logic";
import { TupleClass } from "logic/colorspaces/TupleClass";

export interface TupleTooltipProps<CS extends ColorSpaceName> {
  model: ModelAdapter<CS> | CS;
  values: ColorTuple<CS> | TupleClass<CS>;
  precision?: number;
}

/**
 * displays each channel name with its value
 */
export const TupleTooltip = <CS extends ColorSpaceName>({
  model,
  values,
  precision = 0,
}: TupleTooltipProps<CS>) => (
  <div>
    {eitherToModel(model).channels.map((channel, i) => (
      <div key={channel.key}>
        {channel.name}: {round(values[i], precision)}
      </div>
    ))}
  </div>
);

/**
 * Factory function creates a version of TupleTooltip which takes a
 * ColorAdapter as the props and can therefore be passed directly to colorToTooltip.
 * Needs to know the model to use.
 */
export const tupleTooltipFactory =
  <CS extends ColorSpaceName>(model: ModelAdapter<CS> | CS) =>
  (color: ColorAdapter) =>
    (
      // eslint-disable-next-line react/destructuring-assignment
      <TupleTooltip model={model} values={color.toCs(model).deNormalize()} />
    );
