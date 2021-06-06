import { Route, Switch } from "react-router-dom";
import React from "react";
import { TopMenu } from "./Menu";
import { Home } from "./Home";
import { PAGES } from "./AppPages";

/**
 * the body of the app
 * switch between page content based on the url
 */
export const Body = () => (
  <Switch>
    {PAGES.map(({ title, path, Component }) => (
      <Route key={path} path={`/${path}`}>
        <TopMenu currentTitle={title} currentPath={path} />
        <div className="content">
          <Component />
        </div>
      </Route>
    ))}
    <Route exact path="/">
      <TopMenu currentTitle="Home" currentPath="/" />
      <div className="content">
        <Home />
      </div>
    </Route>
  </Switch>
);
