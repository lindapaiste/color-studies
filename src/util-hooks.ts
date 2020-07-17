import {useState} from "react";

/**
 * hook which allows setState to set only a partial state
 */
export const usePartialState = <T>(initialState: T): [T, (v: Partial<T>) => void] => {
    const [state, setState] = useState(initialState);

    return [
        state,
        (changes: Partial<T>) => setState(prevState => ({...prevState, ...changes}))
    ];
};

/**
 * interface for components which get a partial update function
 */
export interface StateUpdateProps<T> {
    state: T;
    update(s: Partial<T>): void;
}
