import React from "react";
import { StateUpdateProps } from "lib";
import { Option, Select, SelectModel, WeightsInput } from "components";
import { ColorTuple } from "logic";
import { Algo, FormulaSettings } from "logic/difference/types";

/**
 * only "Euclidean" can use multiple colorspaces,
 * "CIE2000" and "CIE1994" both use LCH only
 * so need to set model lch and disable changing it
 */
export const DifferenceControls = ({
  state,
  update,
}: StateUpdateProps<FormulaSettings>) => (
  <div
    style={{
      display: "flex",
    }}
  >
    <Select
      label="Algorithm"
      value={state.algo}
      onChange={(v) =>
        v === "Euclidean"
          ? update({ algo: v })
          : update({ algo: v as Algo, model: "lch" })
      }
      style={{
        width: "25%",
      }}
    >
      <Option value="CIE2000">CIE 2000</Option>
      <Option value="CIE1994">CIE 1994</Option>
      <Option value="Euclidean">Euclidean</Option>
    </Select>
    <SelectModel
      disabled={state.algo !== "Euclidean"}
      value={state.model}
      onChange={(v) => update({ model: v })}
      style={{
        width: "25%",
      }}
    />
    <WeightsInput
      model={state.model}
      weights={state.weights as ColorTuple<typeof state.model>}
      onChange={(v) => update({ weights: v })}
      containerStyle={{
        width: "50%",
      }}
    />
  </div>
);
