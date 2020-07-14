import React, {ChangeEvent} from "react";

export interface Props {
    value: number | undefined;
    onChange(n: number,  e: ChangeEvent<HTMLInputElement>): void;
    isInt?: boolean;
}

export const NumberInput = ({value, onChange, isInt}: Props) => (
    <input
        type="number"
        value={value}
        onChange={e => onChange(isInt ? parseInt(e.target.value, 10) : parseFloat(e.target.value), e)}
    />
);
