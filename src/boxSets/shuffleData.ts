import { shuffle, flatten } from "lodash";
import { BoxData } from "./types";


/**
 * keeps the same number of matches in each box, but randomizes
 */
export const shuffleData
= <T>(data: BoxData<T>[]): BoxData<T>[] => {
    const allMatches = shuffle(flatten(data.map(o => o.matches)));
    return data.map((box, i) => {
        const start = data
            .slice(0, i)
            .reduce((sum, obj) => sum + obj.matches.length, 0);
        const end = start + box.matches.length;
        return {
            color: box.color,
            matches: allMatches.slice(start, end)
        };
    });
};
