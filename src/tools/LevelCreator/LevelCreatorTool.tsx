import React, { useCallback, useState } from "react";
import { Accordion, Button } from "components";
import { makeArray } from "lib";
import { Formula } from "logic/difference/Formula";
import { usePartialState } from "lib/util-hooks";
import { FormulaSettings } from "logic/difference/types";
import { generateBoxes } from "logic/boxSets/generateBoxBalls";
import { DEFAULT_NOISE_SETTINGS } from "logic/noise/types";
import { ModelNoise } from "logic/noise/modelNoise";
import { BoxData } from "logic/boxSets/types";
import { ColorAdapter } from "logic/convert";
import { logJson } from "logic/boxSets/jsonDump";
import {
  AdvancedSettingsControls,
  mapSettingsInterface,
} from "./AdvancedSettingsControls";
import { BallsEditor } from "./BallEditor";
import { AdvancedSettings, BallDisplaySettings } from "./types";
import { BallEditorControls } from "./BallsEditorControls";
import { DistanceGrid } from "../DistanceGrid/DistanceGrid";
import { BoxColorControls } from "./BoxColorControls";
import { DEFAULT_LEVERS } from "../NoisyBoxes/NoisyBoxes";
import { randomColor } from "../../logic/convert/random";

const initialFormulaSettings: FormulaSettings = {
  algo: "Euclidean",
  model: "rgb",
  weights: [1, 1, 1, 1],
};

export const LevelLoader = ({
  colors,
  settings,
}: {
  settings: AdvancedSettings;
  colors: ColorAdapter[];
}) => {
  const generateBalls = useCallback(
    () => generateBoxes(colors, mapSettingsInterface(settings)),
    [colors, settings]
  );

  const [data, setData] = useState<BoxData[]>([]);

  const [display, updateDisplay] = usePartialState<BallDisplaySettings>({
    darkBackground: true,
    shuffle: false,
    showTools: true,
    showRejected: false,
  });

  return (
    <div>
      <Button onClick={() => setData(generateBalls())}>Load Balls</Button>
      {data.length > 0 && (
        <BallEditorControls state={display} update={updateDisplay} />
      )}
      <Button onClick={() => logJson(data, settings)}>Log JSON</Button>
      <BallsEditor
        data={data}
        setData={setData}
        settings={mapSettingsInterface(settings)}
        {...display}
      />
    </div>
  );
};

export const LevelCreatorTool = () => {
  const [colors, setColors] = useState(makeArray(4, randomColor));

  const [settings, updateSettings] = usePartialState<AdvancedSettings>({
    ...DEFAULT_LEVERS,
    formula: new Formula(initialFormulaSettings),
    noise: new ModelNoise(DEFAULT_NOISE_SETTINGS),
    count: 10,
  });

  return (
    <div>
      <div>
        <BoxColorControls colors={colors} setColors={setColors} />
        <Accordion title="Advanced">
          <AdvancedSettingsControls state={settings} update={updateSettings} />
        </Accordion>
        <Accordion title="Box Distance">
          <DistanceGrid calculator={settings.formula} colors={colors} />
        </Accordion>
      </div>
      <LevelLoader settings={settings} colors={colors} />
    </div>
  );
};
