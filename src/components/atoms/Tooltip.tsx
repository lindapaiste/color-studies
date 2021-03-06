import MTooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import React from "react";

/**
 * mostly exists for decoupling from material UI (but I'm passing through so....)
 * and for standardized formatting -- though right now it's just adding arrow
 *
 * prop children is REQUIRED because the tooltip is wrapped around its hover targets
 *
 * adding an extra div for the ref screws up flexbox layouts
 */
export const Tooltip = ({
  title,
  arrow = true,
  children,
  ...props
}: TooltipProps) => (
  <MTooltip {...props} title={title} arrow={arrow}>
    {children}
  </MTooltip>
);
