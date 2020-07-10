import {Evaluation, GetDistance, Levers} from "./types";
import {isEqual} from "lodash";

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
    //has same indexes
    const distances = choices.map(choice => getDistance(choice, color));

    //use spread so as so to impact the distances array
    const sortedDistances = [...distances].sort();

    const matchDistance = sortedDistances[0];

    const nextDistance = sortedDistances[1];

    const distinctness = nextDistance - matchDistance;

    const match = choices[distances.indexOf(matchDistance)];

    return {
        color,
        match,
        distance: matchDistance,
        distinctness
    };
};

/**
 * transforms the evaluation object into a boolean can/cannot go in box
 * if cannot, returns the reason why not
 */
export const getError = <T>(
    evaluation: Evaluation<T>,
    levers: Levers,
    expected?: T
): string | false => {
    const {match, distance, distinctness} = evaluation;

    const {minDistance, maxDistance, minDistinctness, maxDistinctness} = levers;

    if (expected !== undefined && !isEqual(match, expected)) {
        return `wrong match: closer to ${match} than to ${expected}`;
    } else if (distance > maxDistance) {
        return `not close enough to color: distance ${distance} exceeds allowed amount ${maxDistance}`;
    } else if (distance < minDistance) {
        return `too close to color: distance ${distance} must be at least ${minDistance}`;
    } else if (distinctness > maxDistinctness) {
        return `too obvious: distinctness amount ${distinctness} exceeds allowed ${maxDistinctness}`;
    } else if (distinctness < minDistinctness) {
        return `too ambiguous: distinctness ${distinctness} must be at least ${minDistinctness}`;
    } else return false;
};
