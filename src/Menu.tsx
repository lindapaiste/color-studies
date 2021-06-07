import { Link } from "react-router-dom";
import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { PAGES } from "./AppPages";
import { MenuIcon } from "./components";

/**
 * props title and path refer to the current page
 */
export interface Props {
  currentTitle: string;
  currentPath: string;
}

/**
 * Toolbar shows the title of the current page
 * and a hamburger icon dropdown menu
 */
export const TopMenu = ({ currentTitle }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <IconButton
          edge="start"
          aria-label="menu"
          onClick={() => setOpen(!open)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">{currentTitle}</Typography>
        <Menu open={open} onClose={() => setOpen(false)}>
          <MenuItem>
            <Link to="/">Home</Link>
          </MenuItem>
          {PAGES.map(({ title, path }) => (
            <MenuItem key={path}>
              <Link to={`/${path}`}>{title}</Link>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
