import React, {DetailedHTMLProps, HTMLAttributes} from "react";
import {ElementProps} from "../form/types";

export type Props = ElementProps<HTMLDivElement> & {
    wrap?: boolean | "nowrap" | "wrap" | "wrap-reverse";
}

/**
 * I use flex rows so much that it makes sense to put it in an element
 */
export const FlexRow = ({style = {}, wrap = false, ...props}: Props) => (
    <div
        {...props}
        style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: typeof wrap === "string" ? wrap : wrap ? "wrap" : "nowrap",
            alignItems: "center",
            ...style,
        }}
    />
)

export default FlexRow;
