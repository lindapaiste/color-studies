import React, {ComponentType} from "react";
import "./styles.css";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import {TestGroups} from "./classifier/TestResults";
import {PlotFeaturesTool} from "./classifier/PlotFeaturesTool";
import {TestBoundaries} from "./classifier/TestBoundaries";
import {CompareRandom} from "./noise/CompareMethods";
import {RandomVisualizeDifference} from "./difference/VisualizeDifference";
import {TestForce} from "./grouping/ForceToRules";
import {RenderGroups} from "./grouping/RenderGroups";
import {HistogramTool} from "./histogram/HistogramTool";
import {Sample} from "./luminosity/LuminosityChart";
import {GradientCompareTool} from "./boxSets/GradientCompareTool";
import {ColorWheelComparison} from "./rainbow/ColorWheelComparison";
import {ColorInfoTool} from "./ColorInfoTool";
import {GroupsAnalysis} from "./grouping/AnalysisTable";
import {NoisyBoxTool} from "./boxSets/NoisyBoxes";

interface AppPage {
    title: string;
    description?: string;
    path: string; //do not include the slash at start
    Component: ComponentType<{}>;
}

//should appear in the order that I want in the menu
//could allow subpage support to do nesting
const PAGES: AppPage[] = [
    {
        title: "Plot Group Properties",
        path: "plot-features",
        Component: PlotFeaturesTool,
    },
    {
        title: "Group Property Histograms",
        path: "histogram",
        Component: HistogramTool,
    },
    {
        title: "Color Difference",
        path: "difference",
        Component: RandomVisualizeDifference,
    },
    {
        title: "Noise Generation Methods",
        path: "noise",
        Component: CompareRandom,
    },
    {
        title: "Generate Box Balls",
        path: "boxes",
        Component: NoisyBoxTool,
    },
    {
        title: "Gradient Mode Comparison",
        path: "gradient",
        Component: GradientCompareTool,
    },
    {
        title: "Hue Rainbow Comparison",
        path: "rainbow",
        Component: ColorWheelComparison,
    },
    {
        title: "Force Color To Group",
        path: "force",
        Component: TestForce,
    },
    {
        title: "Color Info",
        path: "info",
        Component: ColorInfoTool,
    },
    {
        title: "View Groups",
        path: "groups",
        Component: RenderGroups,
    },
    {
        title: "Group Boundaries",
        path: "boundaries",
        Component: TestBoundaries,
    },
    {
        title: "Lightness v. Luminosity",
        path: "luminosity",
        Component: Sample,
    },
    {
        title: "Group Property Data",
        path: "analysis",
        Component: GroupsAnalysis,
    },
    {
        title: "Perceptron Results",
        path: "perceptron",
        Component: TestGroups,
    }
    //classify tool?  needs data input
];

export const Menu = () => {
    return (
        <ul>
            {PAGES.map(({title, path}) => (
                <li key={path}>
                    <Link to={"/" + path}>{title}</Link>
                </li>
            ))}
        </ul>
    )
};

export const Home = () => (
    <Menu/>
);

export const Body = () => {
    return (
        <Switch>
            {PAGES.map(({title, path, Component}) => (
                <Route
                    key={path}
                    path={"/" + path}
                >
                    <Component/>
                </Route>
            ))}
            <Route exact path="/">
                <Home/>
            </Route>
        </Switch>
    )
};

export default function App() {
    return (
        <BrowserRouter>
            <Body/>
        </BrowserRouter>
    )
}
