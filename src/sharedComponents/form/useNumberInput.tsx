import React, {useState} from "react";
import {UseFormTuple} from "./types";
import {NumberInput} from "./NumberInput";

export const useNumberInput = (initialValue?: number, isInt?: boolean): UseFormTuple<number> => {
  const [value, setValue] = useState(initialValue);

  return [
      value || -1,
      () => <NumberInput value={value} onChange={setValue} isInt={isInt}/>
  ]
};
