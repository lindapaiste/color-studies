import React, {FunctionComponent, useMemo, useState} from "react";
import {makeArray} from "../../lib";
import {usePartialState} from "../../lib/util-hooks";
import {FormulaSettings} from "../../difference/types";
import {DifferenceControls} from "../DistanceGrid/DifferenceControls";
import {Calculation} from "../../difference/Calculation";
import {Formula} from "../../difference/Formula";
import {Title} from "../../sharedComponents/ui/Title";
import {SelectColor} from "../../sharedComponents/form/SelectColor";
import {DataPoint, RenderBracketedDifference} from "./RenderBracketedDifference";
import {CalculationTooltip} from "./CalculationTooltip";
import {randomColor} from "../../color";

export interface Props {
    count?: number;
}

export const VisualizeDifference: FunctionComponent<Props> = ({count = 300}) => {
    const [color, setColor] = useState(randomColor);

    const [state, update] = usePartialState<Required<FormulaSettings>>({
        algo: "CIE2000",
        model: "lch",
        weights: [1, 1, 1, 1]
    });

    const formula = useMemo(
        () => new Formula(state), [
            state.model,
            state.algo,
            state.weights
        ]);

    const samples = useMemo(() => makeArray(count, randomColor), [color, count]);

    const data: DataPoint[] = useMemo(() => {
        return samples.map(c => {
            const calc = new Calculation(formula, c, color);
            return ({
                color: c,
                deltaE: calc.deltaE,
                tooltip: CalculationTooltip(calc),
            })
        });
    }, [samples, formula])

    return (
        <div>
            <div>
                <SelectColor
                    label="Start Color"
                    value={color}
                    onChange={setColor}
                    width={300}
                    height={100}
                    randomize={true}
                />
                <div>Adjust the parameters for calculating difference</div>
                <DifferenceControls
                    state={state}
                    update={update}
                />
            </div>
            <div>
                <Title>Randomly-Generated Colors Sorted by DeltaE</Title>
                <RenderBracketedDifference
                    data={data}
                />
            </div>
        </div>
    );
};

