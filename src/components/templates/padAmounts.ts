import { mapValues } from "lib";
import { Padding, Sides } from "./withPadding";

/**
 * parses percents into numbers based on the width
 * takes single numbers or percents and applies to each direction
 */
export const padAmounts = ({
  width,
  toolPadding,
}: {
  width: number;
  toolPadding: number | string | Padding;
}): Record<Sides, number> => {
  // turn string percents into numbers and undefined into 0
  // percents are always based of width even if for top/bottom
  const handleValue = (value: string | number | undefined): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string")
      return Math.round((width * parseFloat(value)) / 100);
    return 0;
  };

  const fallback = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  if (typeof toolPadding === "object") {
    // can't use map values alone because it might have missing keys
    return {
      ...fallback,
      ...mapValues(toolPadding, handleValue),
    };
  }

  const value = handleValue(toolPadding);
  return mapValues(fallback, () => value);
};
