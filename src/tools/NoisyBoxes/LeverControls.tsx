import {Levers} from "../../boxSets/types";
import React from "react";
import {Slider} from "@material-ui/core";
import {StateUpdateProps} from "../../lib/util-hooks";

/**
 * UI Component for setting values of Levers interface
 *
 * should not be tied to any one tool so that multiple tools/components can use the same set of controls
 */

export const LeverControls = ({state, update}: StateUpdateProps<Levers>) => {

    return (
        <div
            style={{
                display: "flex",
                margin: "1%"
            }}
        >
            <div
                style={{
                    flex: 1,
                    marginRight: "5%",
                    minWidth: 100,
                    maxWidth: 300
                }}
            >
                <span>Color Distance from Ball to Box:</span>
                <Slider
                    min={0}
                    max={100}
                    value={[state.minDistance, state.maxDistance]}
                    onChange={(_, value) => {
                        if (Array.isArray(value)) {
                            update({minDistance: value[0], maxDistance: value[1]});
                        }
                    }}
                    valueLabelDisplay="auto"
                />
            </div>
            <div
                style={{
                    flex: 1,
                    minWidth: 100,
                    maxWidth: 300
                }}
            >
                <span>Distinctness of Match:</span>
                <Slider
                    min={0}
                    max={100}
                    value={[state.minDistinctness, state.maxDistinctness]}
                    onChange={(_, value) => {
                        if (Array.isArray(value)) {
                            update({
                                minDistinctness: value[0],
                                maxDistinctness: value[1]
                            });
                        }
                    }}
                    valueLabelDisplay="auto"
                />
            </div>
        </div>
    );
};
