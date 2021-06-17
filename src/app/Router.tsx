import { Route, Switch } from "react-router-dom";
import React from "react";
import { TopMenu } from "./Menu";
import { Home } from "./Home";
import { SECTIONS } from "./AppPages";

/**
 * the body of the app
 * switch between page content based on the url
 */
export const Body = () => (
  <Switch>
    {SECTIONS.flatMap(({ pages }) =>
      pages.map(({ path, title, Component }) => (
        <Route key={path} path={`/${path}`}>
          <TopMenu currentTitle={title} currentPath={path} />
          <div className="content">
            <Component />
          </div>
        </Route>
      ))
    )}
    <Route exact path="/">
      <TopMenu currentTitle="Home" currentPath="/" />
      <div className="content">
        <Home />
      </div>
    </Route>
  </Switch>
);
