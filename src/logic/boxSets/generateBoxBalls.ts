import { BoxData, Evaluation, Levers, MatchError } from "./types";
import { getError, matchToChoices } from "./colorMatchesBox";
import { ColorAdapter } from "../convert";

/**
 * changeable settings for box balls:
 *
 * formula to calculate distance:
 * -- base formula: euclidean vs 1994 vs 2000
 * -- weights to apply
 * -- color space to use (euclidean only)
 *
 * levers:
 * -- min and max distance from color to box
 * -- min and max distinctness of match compared to other boxes
 *
 * noise generation:
 * -- noise ratio
 * -- which channels or color space to apply noise to
 */

export interface BallCreateSettings extends Levers {
  getDistance(a: ColorAdapter, b: ColorAdapter): number;

  createNoisy(c: ColorAdapter): ColorAdapter;

  count: number;
}

// TODO: estimate noise amount based on levers

/**
 * this function returns all of the possible matches, along with their evaluations,
 * and leaves it up to the renderer to filter out matches which do not fit the constraints
 */
/* const generateBoxData = (color: ColorAdapter, choices: ColorAdapter[], count: number, noiseRatio: number, colorSpace: ColorSpaceName): BoxData => {
    const noisyColors = makeArray(count, () => withModelNoise({color, noiseRatio, colorSpace}));
    return {
        color,
        matches: noisyColors.map(noisy => matchToChoices(
            deltaE76, // which distance model to use?
            noisy,
            choices
        )),
        rejected: []
    }
}; */

/**
 * this version analyzes the data itself, discarding bad matches and looking for more until the count is hit
 * or 1000 attempts have been made, whichever comes first
 */
const generateBoxContents = (
  color: ColorAdapter,
  settings: BallCreateSettings,
  choices: ColorAdapter[]
): BoxData => {
  const { createNoisy, getDistance, count } = settings;

  const matches: Evaluation[] = [];
  const rejected: (Evaluation & { error: MatchError })[] = [];
  // use i to prevent infinite loops due to contradictory parameters
  let i = 0;
  while (matches.length < count && i < 1000) {
    const noisy = createNoisy(color);
    console.log({ noisy });
    // must ensure that the noisy value is still closest to this box vs other boxes
    // also want to make sure that this distinction is obvious - ie. it is much closer
    const evaluation = matchToChoices(getDistance, noisy, choices);

    const error = getError(evaluation, settings, color);
    if (error !== false) {
      console.log(
        `noisy color ${noisy.hex()} failed for box color ${noisy.hex()} with error \n"${
          error.code
        }: ${error.message}"`
      );
      rejected.push({ ...evaluation, error });
    } else {
      matches.push(evaluation);
    }
    i++;
  }

  return {
    color,
    matches,
    rejected,
  };
};

/**
 * when only needing to replace one ball
 */
export const generateBall = (
  color: ColorAdapter,
  settings: BallCreateSettings,
  choices: ColorAdapter[]
): Evaluation => {
  const contents = generateBoxContents(
    color,
    { ...settings, count: 1 },
    choices
  );
  return contents.matches[0];
};

export const generateBoxes = (
  colors: ColorAdapter[],
  settings: BallCreateSettings
): BoxData[] =>
  colors.map((color) => generateBoxContents(color, settings, colors));
