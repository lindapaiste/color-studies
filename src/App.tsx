import React from "react";
import { BrowserRouter } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core";
import { Body } from "./Router";
import { theme } from "./theme";
import "./styles.css";

export default function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Body />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}
