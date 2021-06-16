import React, { FC } from "react";
import { makeStyles } from "@material-ui/core";

/**
 * Special styling for a row of controls based on the number of elements.
 * Assumes that all elements should be evenly sized and spaced.
 */

const useStyles = makeStyles((theme) => ({
  row: {
    display: "flex",
    flexDirection: "row",
    margin: theme.spacing(2, 0),
    [theme.breakpoints.down("xs")]: {
      flexWrap: "wrap",
    },
  },
  element: {
    maxWidth: 250,
    minWidth: 100,
    flexGrow: 1,
    margin: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      width: "50%",
    },
    [theme.breakpoints.up("xs")]: {
      flexShrink: 1,
    },
  },
}));

export const ControlRow: FC = ({ children }) => {
  // const count = React.Children.count(children);
  const classes = useStyles();

  return (
    <div className={classes.row}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child as any, { className: classes.element })
      )}
    </div>
  );
};
