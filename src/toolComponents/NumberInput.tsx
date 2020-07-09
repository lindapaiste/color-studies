import React from "react";

export const NumberInput = ({value, onChange}: { value: number | undefined, onChange: (n: number) => void }) => (
    <input
        type="number"
        value={value}
        onChange={e => onChange(parseInt(e.target.value, 10))}
    />
);
