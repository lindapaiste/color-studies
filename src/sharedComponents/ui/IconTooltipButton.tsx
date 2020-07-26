import React, {MouseEventHandler, ReactNode} from "react";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton, {IconButtonProps} from "@material-ui/core/IconButton";

/**
 * a button which shows just the icon and no text,
 * but includes text in a tooltip on hover
 */

export interface Props {
    /**
     * the text of the tooltip, or a custom node to appear inside the tootip
     * should not be the <Tooltip> element, just the contents
     */
    title: string | NonNullable<ReactNode>;
    /**
     * the icon element, ie. "<RefreshIcon />"
     * any props for the icon should be already applied to the passed element
     */
    icon: ReactNode;
    /**
     * handler receives the click event as its only prop
     */
    onClick: MouseEventHandler<HTMLButtonElement>;
}

export const IconTooltipButton = ({title, icon, onClick, ...props}: Props & IconButtonProps) => (
    <Tooltip title={title} arrow>
        <IconButton {...props} onClick={onClick}>
            {icon}
        </IconButton>
    </Tooltip>
);
