import React, {ChangeEvent} from "react";

/**
 * calls required prop onChange with the string value of the input
 * standard onChange is no longer called, so Omit for clarity
 */
type Props = Omit<JSX.IntrinsicElements["input"], "onChange"> & {
  onChange: (v: string,  e: ChangeEvent<HTMLInputElement>) => void;
};

export const TextInput = ({ onChange, ...props }: Props) => (
  <input {...props} onChange={e => onChange(e.target.value, e)} />
);
