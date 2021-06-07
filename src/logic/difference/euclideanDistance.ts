/**
 * for hues which have NaN, consider the difference to be 0.
 * needs special treatment or else the distance is NaN
 */
const nanFix = (n: number): number => (Number.isNaN(n) ? 0 : n);

/**
 * for ease of use, I am defining the tuples as number[]
 * but note that errors will occur if b is shorter than a
 * weights can have additional entries, but must have at least as many as a.length
 *
 * the raw distance is impacted by the maximum values of each channel in the color space
 * as well as the weights, where weight > 1 will increase the total and weight < 1 will decrease it
 */
export const rawDistance = (
  a: number[],
  b: number[],
  weights: number[]
): number => {
  const squaredSum = a.reduce(
    (acc, curr, i) => acc + weights[i] * nanFix(curr - b[i]) ** 2,
    0
  );
  return Math.sqrt(squaredSum);
};
