import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineHome, FiChevronRight } from "react-icons/all";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { AppPage, SECTIONS } from "./AppPages";
import { MenuIcon } from "./components";

const useStyles = makeStyles((theme: Theme) => ({
  link: {
    color: theme.palette.text.primary,
    textDecoration: "none",
  },
  item: {},
  icon: {
    fontSize: "1.5rem",
    color: "#464646",
  },
  title: {
    marginLeft: theme.spacing(2),
  },
  sectionTitle: {
    color: theme.palette.text.disabled,
    // justifyContent: "flex-end",
    fontSize: "0.8rem",
    borderTop: "1px solid #ececec",
  },
}));

/**
 * Extract the JSX for a page link so that the same code can be used for the
 * home link as inside the pages loop.
 */
const PageLink = ({
  path,
  title,
  icon: Icon = FiChevronRight,
}: Pick<AppPage, "path" | "title" | "icon">) => {
  const classes = useStyles();
  return (
    <NavLink to={`/${path}`} className={classes.link}>
      <MenuItem key={path}>
        <Icon className={classes.icon} />
        <Typography className={classes.title}>{title}</Typography>
      </MenuItem>
    </NavLink>
  );
};

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
  const classes = useStyles();
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
          <PageLink path="" title="Home" icon={AiOutlineHome} />
          {SECTIONS.map(({ title: sectionTitle, pages }) => (
            <div key={sectionTitle}>
              <MenuItem className={classes.sectionTitle}>
                {sectionTitle}
              </MenuItem>
              {pages.map((props) => (
                <PageLink {...props} key={props.path} />
              ))}
            </div>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
