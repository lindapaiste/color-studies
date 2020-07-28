import {BoxData, JSON_Level} from "./types";
import {flatMap, shuffle, omit} from "../lib";
import {AdvancedSettings} from "../tools/LevelCreator/types";

export const createLevelJson = (data: BoxData[]): JSON_Level => {
    const boxColors = data.map(box => box.color.hex());
    const boxes = boxColors.map(color => ({color}));
    const balls = shuffle(flatMap(data,
        box => box.matches.map(
            match => ({
                color: match.color.hex(),
                correctBox: boxColors.indexOf(match.match.hex()),
            })
        )
    ));
    return {
        boxes,
        balls,
    }
}

export const logJson = (data: BoxData[], settings: AdvancedSettings): void => {
    console.log(JSON.stringify({
        ...createLevelJson(data),
        meta: levelMeta(settings),
    }));
}

export const levelMeta = (settings: AdvancedSettings) => {
    const {formula, count, noise, ...levers} = settings;
    return {
        levers,
        noise: omit( noise, 'getNoisy'),
    }
}
