import { flatMap, omit, shuffle } from "lib";
import { BoxData, JsonLevel } from "./types";
import { AdvancedSettings } from "../../tools/LevelCreator/types";

export const createLevelJson = (data: BoxData[]): JsonLevel => {
  const boxColors = data.map((box) => box.color.hex());
  const boxes = boxColors.map((color) => ({ color }));
  const balls = shuffle(
    flatMap(data, (box) =>
      box.matches.map((match) => ({
        color: match.color.hex(),
        correctBox: boxColors.indexOf(match.match.hex()),
      }))
    )
  );
  return {
    boxes,
    balls,
  };
};

export const levelMeta = (settings: AdvancedSettings) => {
  const { formula, count, noise, ...levers } = settings;
  return {
    levers,
    noise: omit(noise, "getNoisy"),
  };
};

export const logJson = (data: BoxData[], settings: AdvancedSettings): void => {
  console.log(
    JSON.stringify({
      ...createLevelJson(data),
      meta: levelMeta(settings),
    })
  );
};
