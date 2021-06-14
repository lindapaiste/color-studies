import React from "react";
import { Link } from "react-router-dom";
import { Grid, Paper, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { AiOutlineInfoCircle } from "react-icons/all";
import { Title, Tooltip } from "components";
import { SECTIONS } from "./AppPages";
import { sampleGroupHexes } from "./logic/classification/training/shuffledData";

const iconShared = createStyles({
  icon: {
    position: "absolute",
    top: "0.5rem",
    color: "white",
  },
}).icon;

const useStyles = makeStyles({
  link: {
    textDecoration: "none",
    color: "black",
    textAlign: "center",
  },
  root: {
    flexGrow: 1,
    padding: "2rem",
  },
  paper: {
    height: "6rem",
    padding: ".5rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  title: {
    fontSize: "1.6rem",
    padding: ".5rem",
    textAlign: "center",
    flexGrow: 1,
  },
  toolIcon: {
    ...iconShared,
    left: "0.5rem",
    opacity: 0.8,
  },
  infoIcon: {
    ...iconShared,
    right: "0.5rem",
  },
});

const useTooltipStyles = makeStyles({
  tooltip: {
    background: "white",
    fontSize: "1rem",
    border: "1px solid #dadde9",
    color: "darkgray",
  },
  arrow: {
    color: "white",
  },
});

export const Home = () => {
  const classes = useStyles();
  const tooltipClasses = useTooltipStyles();
  return (
    <div>
      {SECTIONS.map(({ title: sectionTitle, pages }) => {
        const backgroundColors = sampleGroupHexes("Candy", pages.length);
        return (
          <section key={sectionTitle}>
            <Title>{sectionTitle}</Title>
            <Grid container spacing={5} className={classes.root}>
              {pages.map(
                ({ title: pageTitle, path, description, icon: Icon }, i) => (
                  <Grid item xs={6} sm={4} md={3} key={path}>
                    <Link to={`/${path}`} className={classes.link}>
                      <Paper
                        elevation={5}
                        className={classes.paper}
                        style={{ background: backgroundColors[i] }}
                      >
                        <Icon className={classes.toolIcon} size="1.8rem" />
                        <Typography variant="h3" className={classes.title}>
                          {pageTitle}
                        </Typography>
                        <Tooltip
                          title={description ?? pageTitle}
                          classes={tooltipClasses}
                        >
                          <div>
                            {/* need this to handle the tooltip ref */}
                            <AiOutlineInfoCircle
                              className={classes.infoIcon}
                              size="1rem"
                            />
                          </div>
                        </Tooltip>
                      </Paper>
                    </Link>
                  </Grid>
                )
              )}
            </Grid>
          </section>
        );
      })}
    </div>
  );
};
