import React from "react";
import {ColorTuple} from "../../spacesChannels/types";
import {WeightsInput} from "../../sharedComponents/form/WeightsInput";
import {SelectModel} from "../../sharedComponents/form/SelectModel";
import {Option} from "../../sharedComponents/form/Option";
import {StateUpdateProps} from "../../lib/util-hooks";
import {Algo, FormulaSettings} from "../../difference/types";
import {Select} from "../../sharedComponents/form/Select";

export const DifferenceControls = ({
                                       state,
                                       update
                                   }: StateUpdateProps<FormulaSettings>) => {
    /**
     * only "Euclidean" can use multiple colorspaces,
     * "CIE2000" and "CIE1994" both use LCH only
     * so need to set model lch and disable changing it
     */
    return (
        <div
            style={{
                display: "flex"
            }}
        >
            <Select
                label="Algorithm"
                value={state.algo}
                onChange={v =>
                    v === "Euclidean"
                        ? update({algo: v})
                        : update({algo: v as Algo, model: "lch"})
                }
                style={{
                    width: "25%"
                }}
            >
                <Option value="CIE2000">CIE 2000</Option>
                <Option value="CIE1994">CIE 1994</Option>
                <Option value="Euclidean">Euclidean</Option>
            </Select>
            <SelectModel
                disabled={state.algo !== "Euclidean"}
                value={state.model}
                onChange={v => update({model: v})}
                style={{
                    width: "25%"
                }}
            />
            <WeightsInput
                model={state.model}
                weights={state.weights as ColorTuple<typeof state.model>}
                onChange={v => update({weights: v})}
                containerStyle={{
                    width: "50%"
                }}
            />
        </div>
    );
};
