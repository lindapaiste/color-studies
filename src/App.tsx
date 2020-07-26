import React from "react";
import "./styles.css";
import {BrowserRouter} from "react-router-dom";
import {Body} from "./Router";
import {MuiThemeProvider} from "@material-ui/core";
import {theme} from "./theme";

export default function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <BrowserRouter>
                <Body/>
            </BrowserRouter>
        </MuiThemeProvider>
    );
}
