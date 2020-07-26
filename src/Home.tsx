import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import {Link} from "react-router-dom";
import React from "react";
import {PAGES} from "./AppPages";

/**
 * right now the home page just shows a list of links
 */
export const Home = () => {
    return (
        <List>
            {PAGES.map((
                {title, path} //don't want to include home in list
            ) => (
                <ListItemText
                    key={path}
                    primary={<Link to={"/" + path}>{title}</Link>}
                />
            ))}
        </List>
    );
};
