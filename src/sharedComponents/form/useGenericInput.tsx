import React, {useState} from "react";
import {UseFormTuple} from "./types";

/**
 * input props are passed to the returned component
 * the locally stored value is saved as a string.
 * it is up to the users of this hook to cast to type
 */
export const useGenericInput = (initialValue?: string | number): UseFormTuple<string, JSX.IntrinsicElements['input']> => {
    const [value, setValue] = useState<string>(
        typeof initialValue === "number" ? String(initialValue) :
            typeof initialValue === "string" ? initialValue : ''
    );

    return [
        value,
        (props: JSX.IntrinsicElements['input']) => (
            <input
                {...props}
                onChange={e => setValue(e.target.value)}
            />
        )
    ]
};
