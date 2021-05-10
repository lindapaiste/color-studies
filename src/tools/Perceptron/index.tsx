import {Tool} from "../../sharedComponents/tool/Tool";
import {randomGroup} from "../../grouping";
import PerceptronControls from "./PerceptronControls";
import React from "react";
import {Settings} from "./types";
import usePerceptron from "./usePerceptron";
import RenderPerceptronTest from "./PerceptronResults";

export const PerceptronTool = () => (
    <Tool
        initialSettings={{
            testCount: 400,
            channels: [],
            group: randomGroup().name,
        }}
        RenderControls={PerceptronControls}
        //handle the conditional here
        RenderContents={(settings) => settings.channels.length > 0 ? PerceptronTest(settings) : null}
    />
)

/**
 * apply hook logic to render
 */
export const PerceptronTest = (settings: Settings) => {
    const props = usePerceptron(settings);

    return (
        <RenderPerceptronTest
            {...props}
        />
    )
}

export default PerceptronTool;
