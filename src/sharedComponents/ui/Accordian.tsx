import React, { useState, ReactNode } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";

export interface Props {
  initialOpen?: boolean;
  title: string | ReactNode;
  children: ReactNode;
}

export const Accordian = ({ initialOpen = false, children, title }: Props) => {
  const [open, setOpen] = useState(initialOpen);

  return (
    <Box>
      <Box>
        <IconButton onClick={() => setOpen(!open)}>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
        {typeof title === "string" ? (
          <Typography component="span">{title}</Typography>
        ) : (
          title
        )}
      </Box>
      <Collapse in={open}>{children}</Collapse>
    </Box>
  );
};
