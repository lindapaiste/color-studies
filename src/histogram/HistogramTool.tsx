import React from "react";
import {VisualHistogram} from "./VisualHistogram";
import {getGetter} from "../properties";
import {useSelectGroup} from "../sharedComponents/form/useSelectGroup";
import {useNumberInput} from "../sharedComponents/form/useNumberInput";
import {useSelectProperty} from "../sharedComponents/form/useSelectProperty";

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
