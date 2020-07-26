import React, {DetailedHTMLProps, HTMLAttributes} from "react";

export type ElementProps<T> = DetailedHTMLProps<HTMLAttributes<T>, T>

/**
 * I use flex rows so much that it makes sense to put it in an element
 */
export const FlexRow = ({style = {}, ...props}: ElementProps<HTMLDivElement>) => (
    <div
        {...props}
        style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            ...style,
        }}
    />
)

export default FlexRow;
