import Color from "color";
/**
 * luminosity cannot be set directly
 *
 * want to keep the weights of the RGB channels at the same ratio
 * while increasing or decreasing all to achieve the desired luminosity
 *
 * this means hue is constant
 * right looking at brightness first and using saturation only after brightness maxed
 * rather than adjusting both at the same time
 */
export const setLuminosity = (
  color: Color,
  value: number,
  allowance: number = 0.1
): Color => {
  const lightness = lightnessForLuminosity(color, value, allowance);
  const lighter = color.lightness(lightness);
  if (lightness < 99) {
    return lighter;
  } else {
    const saturation = saturationForLuminosity(lighter, value, allowance);
    return lighter.saturationl(saturation);
  }
};

/**
 * not all luminosities are possible for a given hue
 * depending on the hue, which is a ratio of R:G:B, there is a maximum possible luminosity
 * this is what HSLuv is about
 */
export const maxLuminosity = (color: Color): number => {
  return color
    .lightness(100)
    .saturationl(100)
    .luminosity();
};

/**
 * trying to reverse engineer luminosity, but I haven't figured it out yet
 * so use trial and error to find the best match
 */
export const lightnessForLuminosity = (
  color: Color,
  target: number,
  allowance: number = 0.1
): number => {
  //look at the interval of available brightnesses and refine it through halving
  //this is more efficient than a ++ loop and allows for more accurate refinement
  //special check to see if target requires brightness > 100 rather than getting there by halving
  //not truly needed, just for performance
  if (color.lightness(100).luminosity() < target) {
    return 100;
  }
  let min = 0;
  let max = 100;
  while (max - min > allowance) {
    const mid = (min + max) / 2;
    const lum = color.lightness(mid).luminosity();
    if (lum > target) {
      max = mid;
    } else {
      min = mid;
    }
  }

  //the range of this final min and max is less than the allowance and is guranteed to contain the precise value
  //return the midpoint of range
  return (max + min) / 2;
};

/**
 * trying to reverse engineer luminosity, but I haven't figured it out yet
 * so use trial and error to find the best match
 */
export const saturationForLuminosity = (
  color: Color,
  target: number,
  allowance: number = 0.1
): number => {
  //look at the interval of available brightnesses and refine it through halving
  //this is more efficient than a ++ loop and allows for more accurate refinement
  //special check to see if target requires brightness > 100 rather than getting there by halving
  //not truly needed, just for performance
  if (color.saturationl(100).luminosity() < target) {
    return 100;
  }
  let min = 0;
  let max = 100;
  while (max - min > allowance) {
    const mid = (min + max) / 2;
    const lum = color.saturationl(mid).luminosity();
    if (lum > target) {
      max = mid;
    } else {
      min = mid;
    }
  }

  //the range of this final min and max is less than the accuracy and is guranteed to contain the precise value
  //return the midpoint of range
  return (max + min) / 2;
};

/*

import { PolynomialRegression, ExponentialRegression } from "ml-regression";
import { pointsToVectors, getPoints } from "./LuminosityChart";

export const regressionTest = () => {
  const color = Color("rgb(209, 253, 70)");

  const { x, y } = pointsToVectors(getPoints(color, 0, 50, 5));
  console.log({ x, y });

  const poly = new PolynomialRegression(x, y, 2);
  console.log(poly);
  const exp = new ExponentialRegression(x, y);
  console.log(exp);
};
*/
