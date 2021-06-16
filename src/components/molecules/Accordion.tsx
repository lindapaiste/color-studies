import React, { FunctionComponent, ReactNode, useState } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import { ChevronDownIcon, ChevronUpIcon } from "../atoms/Icons";

export interface Props {
  initialOpen?: boolean;
  title: string | ReactNode;
  /**
   * Can lazily instantiate the children contents by passing a function.
   */
  children: ReactNode | FunctionComponent;
}

export const Accordion = ({ initialOpen = false, children, title }: Props) => {
  const [open, setOpen] = useState(initialOpen);

  return (
    <Box>
      <Box>
        <IconButton onClick={() => setOpen(!open)}>
          {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </IconButton>
        {typeof title === "string" ? (
          <Typography component="span">{title}</Typography>
        ) : (
          title
        )}
      </Box>
      <Collapse in={open}>
        {typeof children === "function" ? children({}) : children}
      </Collapse>
    </Box>
  );
};
