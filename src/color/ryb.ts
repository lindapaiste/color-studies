/**
 * conversion formula described in paper
 * Computational RYG Color Model and its Applications by Junichi Sugita and Tokiichiro Takahashi
 * https:// www.jstage.jst.go.jp/article/tievciieej/5/2/5_110/_pdf/-char/en
 *
 * formulas taken from the paper and coded by me
 *
 * unlike RGB it is additive, meaning red + blue = purple, not magenta; yellow + blue = green, not white
 * therefore white and black are the opposite of RGB, with white as (0,0,0) and black as (1,1,1)
 */
import { ColorTuple } from "../spacesChannels/types";

/**
 * not sure whether to handle values which are or are not normalized to 1,
 * so control this with second parameter max
 *
 * could combine some of the logic of the to and from equations by using a class to handle both,
 * as the intermediate values are the same
 * and some steps use the same logic but with different values (ie. nDivide)
 */
export const rgbToRyb = (
  rgb: ColorTuple<"rgb">,
  max: number = 255
): ColorTuple<"rgb"> => {
  // white component is the min of the three RGB numbers
  const iWhite = Math.min(...rgb);
  // black component is how far the closest of the three is to the max ( 1 or 255 )
  const iBlack = Math.min(...rgb.map((v) => max - v));

  // subtract white component from each of the RGB
  const [rRgb, gRgb, bRgb] = rgb.map((v) => v - iWhite);

  // our first pass at RYB numbers comes from these conversion equations
  // minimum of red and green is a factor in all 3, think of it like "yellowish"
  const minRG = Math.min(rRgb, gRgb);
  // red needs yellowish contribution removed
  const rRyb = rRgb - minRG;
  // yellow is the average of green and yellowish
  const yRyb = (minRG + gRgb) / 2;
  // blue is the average of initial blue and the blue contribution from green, which is green minus yellowish
  const bRyb = (bRgb + gRgb - minRG) / 2;

  // then go through a normalization based on calculated n value
  // which is the ratio of the max of the mapped values to the max of the pre-mapped values
  const n = Math.max(rRyb, yRyb, bRyb) / Math.max(rRgb, gRgb, bRgb);
  // we will divide by this, so need to skip that step if it is 0
  // local function to handle rather than 3 separate if statements
  const nDivide = (value: number): number => (n > 0 ? value / n : value);
  // and add in the black component

  // console.log({iWhite,iBlack,rRgb,gRgb,bRgb, minRG,rRyb,yRyb,bRyb,n});
  return [rRyb, yRyb, bRyb]
    .map(nDivide)
    .map((v) => v + iBlack) as ColorTuple<"rgb">;
};

export const rybToRgb = (
  ryb: ColorTuple<"rgb">,
  max: number = 255
): ColorTuple<"rgb"> => {
  // black is the minimum of the RYB values
  const iBlack = Math.min(...ryb);
  // white is how far the closest of the three is to the max ( 1 or 255 )
  const iWhite = Math.min(...ryb.map((v) => max - v));

  // subtract black from all three
  const [rRyb, yRyb, bRyb] = ryb.map((v) => v - iBlack);

  // conversion equations
  const minYB = Math.min(yRyb, bRyb);
  const rRgb = rRyb + yRyb - minYB;
  const gRgb = yRyb + minYB;
  const bRgb = 2 * (bRyb - minYB);

  // normalize to n and add in white
  const n = Math.max(rRgb, gRgb, bRgb) / Math.max(rRyb, yRyb, bRyb);
  const nDivide = (value: number): number => (n > 0 ? value / n : value);
  return [rRgb, gRgb, bRgb]
    .map(nDivide)
    .map((v) => v + iWhite) as ColorTuple<"rgb">;
};
