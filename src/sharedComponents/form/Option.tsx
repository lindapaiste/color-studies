import MenuItem from "@material-ui/core/MenuItem";
import React, {ReactNode} from "react";

export interface Props {
    value: string | number;
    label: string | number | ReactNode;
}

export const Option = ({value, label}: Props) => (
    <MenuItem value={value}>
        {label}
    </MenuItem>
)
