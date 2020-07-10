import React, {ChangeEvent} from "react";

type Props = Omit<JSX.IntrinsicElements["input"], "onChange"> & {
    onChange: (v: number, e: ChangeEvent<HTMLInputElement>) => void;
    min: number;
    max: number;
};

export const Slider = (props: Props) => (
    <input
        {...props}
        type="range"
        onChange={e => props.onChange(parseInt(e.target.value, 10), e)}
    />
);
