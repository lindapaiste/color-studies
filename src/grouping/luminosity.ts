import Color from "color";

/**
 * not all luminosities are possible for a given hue
 * depending on the hue, which is a ratio of R:G:B, there is a maximum possible luminosity
 * this is what HSLuv is about
 */
export const maxLuminosity = (color: Color): number => {
  return color.lightness(100).luminosity();
};

export const setLuminosity = (color: Color, value: number): Color => {
  //https://www.w3.org/TR/WCAG20/#relativeluminancedef
  //if possible, want to increase the values in each channel while preserving the ratio of R/G/B
  //not all values are possible - depending on the channel ratio, there is a maximum possible luminosity
  //this is what HSLuv is about

  const rgb = color.rgb();
  const current = color.luminosity();

  const weights = [0.2126, 0.7152, 0.0722];

  const channelContributions = weights.map((weight, i) => {
    const chan = rgb[i] / 255;
    const adj =
      chan <= 0.03928 ? chan / 12.92 : Math.pow((chan + 0.055) / 1.055, 2.4);
    return adj * weight;
  });

  const setLumChannel = (index: number, weight: number) => {};
};
