import React, {useCallback, useState} from "react";
import {BoxColorControls} from "./BoxColorControls";
import {makeArray} from "../../lib";
import {Accordion} from "../../sharedComponents/ui";
import {Formula} from "../../difference/Formula";
import {usePartialState} from "../../lib/util-hooks";
import {FormulaSettings} from "../../difference/types";
import {DEFAULT_LEVERS} from "../NoisyBoxes/NoisyBoxes";
import {generateBoxes} from "../../boxSets/generateBoxBalls";
import {DEFAULT_NOISE_SETTINGS} from "../../noise/types";
import {ModelNoise} from "../../noise/modelNoise";
import {BoxData} from "../../boxSets/types";
import {Button} from "sharedComponents/ui/Button";
import {AdvancedSettingsControls, mapSettingsInterface} from "./AdvancedSettingsControls";
import {BallsEditor} from "./BallEditor";
import {AdvancedSettings, BallDisplaySettings} from "./types";
import {BallEditorControls} from "./BallsEditorControls";
import {DistanceGrid} from "../DistanceGrid/DistanceGrid";
import {I_ColorAdapter} from "../../color/types";
import {randomColor} from "../../color";
import {createLevelJson, logJson} from "../../boxSets/jsonDump";

const initialFormulaSettings: FormulaSettings = {
    algo: "Euclidean",
    model: "rgb",
    weights: [1, 1, 1, 1]
};

export const LevelCreatorTool = () => {

    const [colors, setColors] = useState(makeArray(4, randomColor));

    const [settings, updateSettings] = usePartialState<AdvancedSettings>({
        ...DEFAULT_LEVERS,
        formula: new Formula(initialFormulaSettings),
        noise: new ModelNoise(DEFAULT_NOISE_SETTINGS),
        count: 10
    });

    return (
        <div>
            <div>
                <BoxColorControls
                    colors={colors}
                    setColors={setColors}
                />
                <Accordion title="Advanced">
                    <AdvancedSettingsControls
                        state={settings}
                        update={updateSettings}
                    />
                </Accordion>
                <Accordion title="Box Distance">
                    <DistanceGrid
                        calculator={settings.formula}
                        colors={colors}
                    />
                </Accordion>
            </div>
            <LevelLoader
                {...settings}
                colors={colors}
            />
        </div>
    );
};

export const LevelLoader = ({colors, ...props}: AdvancedSettings & { colors: I_ColorAdapter[] }) => {

    const generateBalls = useCallback(
        () => generateBoxes(colors, mapSettingsInterface(props)),
        [colors, ...Object.values(props)]
    );

    const [data, setData] = useState<BoxData[]>([]);

    const [display, updateDisplay] = usePartialState<BallDisplaySettings>({
        darkBackground: true,
        shuffle: false,
        showTools: true,
        showRejected: false,
    })

    return (
        <div>
            <Button onClick={() => setData(generateBalls())}>Load Balls</Button>
            {data.length > 0 &&
            <BallEditorControls state={display} update={updateDisplay}/>
            }
            <Button onClick={() => logJson(data, props)}>Log JSON</Button>
            <BallsEditor data={data} setData={setData} settings={mapSettingsInterface(props)} {...display}/>
        </div>
    )
}

