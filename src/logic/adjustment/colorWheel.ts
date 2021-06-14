/**
 * hue 0-360 does not align with the color wheel. has too much blue green and not enough yellow
 *
 * red: is 0 want 0
 * orange: is 30 want 60
 * yellow: is 60 want 120
 * green: is 120 want 180
 * cyan: is 180 want 210
 * blue: is 240 want 240
 * purple: is 270 want 300
 * magenta: is 300 want 330
 * red is 360 want 360
 */

const ADJUSTMENTS = [
  [0, 0],
  [30, 60],
  [60, 120],
  [120, 180],
  [180, 210],
  [240, 240],
  [270, 300],
  [300, 330],
  [360, 360],
];

export const normalToColorWheel = (hue: number): number => {
  for (let i = 0; i < ADJUSTMENTS.length - 1; i++) {
    const [lowerInput, lowerOutput] = ADJUSTMENTS[i];
    const [upperInput, upperOutput] = ADJUSTMENTS[i + 1];
    // theoretically matches both in the case that hue equals a breakpoint, but will act on the first
    if (lowerInput <= hue && upperInput >= hue) {
      const scale = (upperOutput - lowerOutput) / (upperInput - lowerInput);
      return (hue - lowerInput) * scale + lowerOutput;
    }
  }
  // should never get here
  throw new Error("Error adjusting hue");
};

// follows the same formula, but reverses input and output
export const colorWheelToNormal = (hue: number): number => {
  for (let i = 0; i < ADJUSTMENTS.length - 1; i++) {
    const [lowerOutput, lowerInput] = ADJUSTMENTS[i];
    const [upperOutput, upperInput] = ADJUSTMENTS[i + 1];
    // theoretically matches both in the case that hue equals a breakpoint, but will act on the first
    if (lowerInput <= hue && upperInput >= hue) {
      const scale = (upperOutput - lowerOutput) / (upperInput - lowerInput);
      // console.log({ upperInput, lowerInput, upperOutput, lowerOutput, scale });
      return (hue - lowerInput) * scale + lowerOutput;
    }
  }
  // should never get here
  throw new Error("Error adjusting hue");
};
