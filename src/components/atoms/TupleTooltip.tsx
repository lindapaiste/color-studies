import React from "react";
import { round } from "lodash";
import { ColorSpaceName, ColorTuple } from "logic/spacesChannels/types";
import { ModelAdapter } from "logic/spacesChannels/ModelAdapter";
import { eitherToModel } from "logic/spacesChannels/models";

/**
 * props match those of TupleClass
 */
export interface Props<CS extends ColorSpaceName> {
  model: ModelAdapter<CS> | CS;
  deNormalized: ColorTuple<CS>;
}

/**
 * displays each channel name with its value
 */
export const TupleTooltip = <CS extends ColorSpaceName>({
  model,
  deNormalized,
}: Props<CS>) => (
  <div>
    {eitherToModel(model).channels.map((channel, i) => (
      <div key={channel.key}>
        {channel.name}: {round(deNormalized[i])}
      </div>
    ))}
  </div>
);
