import Paper from "@material-ui/core/Paper";
import {Link} from "react-router-dom";
import React from "react";
import {PAGES} from "./AppPages";
import {sampleGroupHexes} from "./classifier/shuffledData";
import Grid from "@material-ui/core/Grid";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import {Title} from "sharedComponents/ui/Title";

const backgroundColors = sampleGroupHexes("Candy", PAGES.length);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        }
    }),
);

/**
 * right now the home page just shows a list of links
 * note: don't want to include home in list
 */
export const Home = () => {
    const classes = useStyles();

    return (
        <Grid container spacing={5} className={classes.root}>
            {PAGES.map(({title, path}, i) => (
                <Grid item xs={6} sm={4} md={3}>
                    <Link to={"/" + path} key={path} className={classes.link}>
                        <Paper elevation={5} className={classes.paper} style={{background: backgroundColors[i]}}>
                            <Title size={"1.6rem"}>{title}</Title>
                        </Paper>
                    </Link>
                </Grid>
            ))}
        </Grid>
    );
};