import { isEqual } from "lib";
import {
  ErrorCode,
  Evaluation,
  GetDistance,
  Levers,
  MatchError,
} from "./types";

/**
 * given a set of choices, find which choice is the closest match to the provided color
 * return that match along with the distance between match and color
 * and distinctness, which measures how close the color is to the next best match
 */
export const matchToChoices = <T>(
  getDistance: GetDistance<T>,
  color: T,
  choices: T[]
): Evaluation<T> => {
  // has same indexes
  const distances = choices.map((choice) => getDistance(choice, color));

  // use spread so as so to impact the distances array
  // must use a custom sort function because by default, sort using string values -- not numbers
  const sortedDistances = [...distances].sort((a, b) => a - b);

  const matchDistance = sortedDistances[0];

  const nextDistance = sortedDistances[1];

  const distinctness = nextDistance - matchDistance;

  const match = choices[distances.indexOf(matchDistance)];

  return {
    color,
    match,
    distance: matchDistance,
    distinctness,
    distances,
  };
};

/**
 * transforms the evaluation object into a boolean can/cannot go in box
 * if cannot, returns the reason why not
 */
export const getError = <T extends { toString(): string }>(
  evaluation: Evaluation<T>,
  levers: Levers,
  expected?: T
): MatchError | false => {
  const { match, distance, distinctness } = evaluation;

  const { minDistance, maxDistance, minDistinctness, maxDistinctness } = levers;

  if (expected !== undefined && !isEqual(match, expected)) {
    return {
      code: ErrorCode.WRONG_MATCH,
      message: `wrong match: closer to ${match.toString()} than to ${expected.toString()}`,
    };
  }
  if (distance > maxDistance) {
    return {
      code: ErrorCode.DISTANCE_TOO_LARGE,
      message: `not close enough to color: distance ${distance} exceeds allowed amount ${maxDistance}`,
    };
  }
  if (distance < minDistance) {
    return {
      code: ErrorCode.DISTANCE_TOO_SMALL,
      message: `too close to color: distance ${distance} must be at least ${minDistance}`,
    };
  }
  if (distinctness > maxDistinctness) {
    return {
      code: ErrorCode.DISTINCTNESS_TOO_LARGE,
      message: `too obvious: distinctness amount ${distinctness} exceeds allowed ${maxDistinctness}`,
    };
  }
  if (distinctness < minDistinctness) {
    return {
      code: ErrorCode.DISTINCTNESS_TOO_SMALL,
      message: `too ambiguous: distinctness ${distinctness} must be at least ${minDistinctness}`,
    };
  }
  return false;
};
