import React from "react";
import {VisualHistogram} from "./VisualHistogram";
import {getGetter} from "../properties";
import {useSelectGroup} from "../toolComponents/useSelectGroup";
import {useNumberInput} from "../toolComponents/useNumberInput";
import {useSelectProperty} from "../toolComponents/useSelectProperty";
//import {Select} from "@material-ui/core";

/**
 * tool which allows me to interactively create property histograms for any of the stored color groupings
 */
export const HistogramTool = () => {
    const [group, SelectGroup] = useSelectGroup();
    const [count, CountInput] = useNumberInput(6);
    const [property, SelectProperty] = useSelectProperty();
    return (
        <div>
            <div>
                <SelectGroup/>
                <SelectProperty/>
                <CountInput/>
            </div>
            {group !== undefined && property !== undefined && (
                <VisualHistogram
                    getProperty={getGetter(property)}
                    hexes={group.hexes}
                    breakpoints={count}
                    colorSize={50}
                />
            )}
        </div>
    );
};


