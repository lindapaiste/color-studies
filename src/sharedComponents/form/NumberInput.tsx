import React from "react";

export interface Props {
    value: number | undefined;
    onChange: (n: number) => void;
    isInt?: boolean;
}

export const NumberInput = ({value, onChange, isInt}: Props) => (
    <input
        type="number"
        value={value}
        onChange={e => onChange(isInt ? parseInt(e.target.value, 10) : parseFloat(e.target.value))}
    />
);
