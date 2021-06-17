import React from "react";
import { BrowserRouter } from "react-router-dom";
import { MuiThemeProvider, CircularProgress } from "@material-ui/core";
import { Body } from "./Router";
import { theme } from "../theme";
import "../styles.css";

export default function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <React.Suspense fallback={<CircularProgress />}>
        <BrowserRouter>
          <Body />
        </BrowserRouter>
      </React.Suspense>
    </MuiThemeProvider>
  );
}
