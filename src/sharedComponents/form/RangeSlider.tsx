import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
/**
 * should the props take a tuple?  or a separate start and end?
 */

interface ExtraProps {
  min: number;
  max: number;
}

export const RangeSlider = () => {
  return (
    <Slider
      ValueLabelComponent={({ value, open, children }) => (
        <Tooltip title={value} open={open}>
          {children}
        </Tooltip>
      )} // can set placement
    />
  );
};
