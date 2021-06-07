import React, { ReactNode } from "react";
import Typography from "@material-ui/core/Typography";

export interface Props {
  importance?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: string | number;
  children: ReactNode;
}

export const Title = ({ importance = "h2", size, children }: Props) => (
  <Typography
    variant={importance}
    style={{
      fontSize: size,
    }}
  >
    {children}
  </Typography>
);
