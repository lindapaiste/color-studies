import React from "react";

export type Props = JSX.IntrinsicElements["div"] & {
  /**
   * Can pass a boolean value for wrap in addition to the standard strings.
   */
  wrap?: boolean | "nowrap" | "wrap" | "wrap-reverse";
};

/**
 * Making this a function to avoid ESLint no-nested-ternary rule.
 * Helper to convert a boolean to the correct string.
 */
const wrapString = (wrap: boolean) => (wrap ? "wrap" : "nowrap");

/**
 * I use flex rows so much that it makes sense to put it in an element.
 */
export const FlexRow = ({ style = {}, wrap = false, ...props }: Props) => (
  <div
    {...props}
    style={{
      display: "flex",
      flexDirection: "row",
      flexWrap: typeof wrap === "string" ? wrap : wrapString(wrap),
      alignItems: "center",
      ...style,
    }}
  />
);

export default FlexRow;
