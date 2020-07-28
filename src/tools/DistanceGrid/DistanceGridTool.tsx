import React, {useState} from "react";
import {makeArray} from "../../lib";
import {useFormula} from "../../difference/useFormula";
import {Accordion} from "../../sharedComponents/ui";
import {SelectMultipleColors} from "../../sharedComponents/form/SelectMultipleColors";
import {DifferenceControls} from "./DifferenceControls";
import {DistanceGrid} from "./DistanceGrid";
import {randomColor} from "../../color";

/**
 * tool allows for customization of the colors and the deltaE formula
 */
export const DistanceGridTool = () => {
    const [colors, setColors] = useState(makeArray(4, randomColor));
    const [formula, update] = useFormula();

    return (
        <div>
            <Accordion title={"Edit Colors"}>
                <SelectMultipleColors value={colors} onChange={setColors}/>
            </Accordion>
            <Accordion title={"Adjust DeltaE Formula"}>
                <DifferenceControls state={formula} update={update}/>
            </Accordion>
            <DistanceGrid calculator={formula} colors={colors}/>
        </div>
    )
}
