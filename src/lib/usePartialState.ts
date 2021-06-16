import { useCallback, useState } from "react";

/**
 * hook which allows setState to set only a partial state
 */
export const usePartialState = <T>(
  initialState: T
): [T, (v: Partial<T>) => void] => {
  const [state, setState] = useState(initialState);

  /**
   * Takes a partial state and merges it with the current state.
   */
  const update = useCallback(
    (changes: Partial<T>) =>
      setState((prevState) => ({ ...prevState, ...changes })),
    [setState]
  );

  return [state, update];
};

/**
 * interface for components which get a partial update function
 */
export interface StateUpdateProps<T> {
  state: T;
  update: (partial: Partial<T>) => void;
}
