import { Levers } from "./types";
import React, { useState } from "react";
import { Slider } from "@material-ui/core";

export const DEFAULT_LEVERS: Levers = {
    minDistance: 0,
    maxDistance: 20,
    minDistinctness: 10,
    maxDistinctness: 50
};
/**
 * hook automatically applies default settings so that the state is never empty
 */
export const useLevers = (initialValue?: Partial<Levers>) => {
    return useState<Levers>({
        ...DEFAULT_LEVERS,
        ...initialValue
    });
};
/**
 * separated the controls from the results so that other components can use the same set of controls
 */
export const LeverControls = ({
                                  initialValue = {},
                                  onChange
                              }: {
    initialValue?: Partial<Levers>;
    onChange: (s: Levers) => void;
}) => {
    const [state, _setState] = useLevers(initialValue);

    const applySettings = (settings: Partial<Levers>): void => {
        const combined = { ...state, ...settings };
        _setState(combined);
        onChange(combined);
    };

    return (
        <div>
      <span>
        <span>Color Distance from Ball to Box:</span>
        <Slider
            min={0}
            max={100}
            value={[state.minDistance, state.maxDistance]}
            onChange={(_, value) => {
                if (Array.isArray(value)) {
                    applySettings({ minDistance: value[0], maxDistance: value[1] });
                }
            }}
            valueLabelDisplay="auto"
        />
      </span>
            <span>
        <span>Distictness of Match:</span>
        <Slider
            min={0}
            max={100}
            value={[state.minDistinctness, state.maxDistinctness]}
            onChange={(_, value) => {
                if (Array.isArray(value)) {
                    applySettings({
                        minDistinctness: value[0],
                        maxDistinctness: value[1]
                    });
                }
            }}
            valueLabelDisplay="auto"
        />
      </span>
        </div>
    );
};
