import Color from "color";
import { normalToColorWheel, colorWheelToNormal } from "../colorWheel";
import { find, fromPairs } from "lodash";
import { setLuminosity } from "../luminosity";

export interface GroupColorAnalysis {
  hue: PropertyAnalysis;
  wheelHue: PropertyAnalysis;
  luminosity: PropertyAnalysis;
  lightness: PropertyAnalysis;
  saturationl: PropertyAnalysis;
  saturationv: PropertyAnalysis;
  blackness: PropertyAnalysis;
  whiteness: PropertyAnalysis;
}

export interface PropertyAnalysis {
  values: number[];
  min: number;
  max: number;
  spread: number;
  mean: number;
  median: number;
  differences: number[];
  meanDifference: number; //won't be 0 because looking at absolute values
  medianDifference: number;
}

export interface ColorPropGetter {
  (c: Color): number;
}

export interface ColorPropSetter {
  (c: Color, value: number): Color;
}

export type ColorPropKey = keyof GroupColorAnalysis & string; //"hue" | "wheelHue" | "luminosity" | "lightness" | "saturationl" | "saturationv" | "blackness" | "whiteness"

export interface ColorPropDef {
  name: string;
  key: ColorPropKey;
  getter: ColorPropGetter;
  setter: ColorPropSetter;
  range: number; //only providing the max value because assuming that all start at 0
}

export const PROPERTIES: ColorPropDef[] = [
  {
    name: "Hue",
    key: "hue",
    getter: c => c.hue(),
    setter: (c, v) => c.hue(v),
    range: 360
  },
  {
    name: "Color Wheel Hue",
    key: "wheelHue",
    getter: c => normalToColorWheel(c.hue()),
    setter: (c, v) => c.hue(colorWheelToNormal(v)),
    range: 360
  },
  {
    name: "Luminosity",
    key: "luminosity",
    getter: c => c.luminosity(),
    setter: setLuminosity,
    range: 1
  },
  {
    name: "Lightness",
    key: "lightness",
    getter: c => c.lightness(),
    setter: (c, v) => c.lightness(v),
    range: 100
  },
  {
    name: "Saturation L",
    key: "saturationl",
    getter: c => c.saturationl(),
    setter: (c, v) => c.saturationl(v),
    range: 100
  },
  {
    name: "Saturation V",
    key: "saturationv",
    getter: c => c.saturationv(),
    setter: (c, v) => c.saturationv(v),
    range: 100
  },
  {
    name: "Blackness",
    key: "blackness",
    getter: c => c.black(),
    setter: (c, v) => c.black(v),
    range: 100
  },
  {
    name: "Whiteness",
    key: "whiteness",
    getter: c => c.white(),
    setter: (c, v) => c.white(v),
    range: 100
  }
];

export const getAllowance = (
  property: ColorPropKey,
  fuzzPercent: number
): number => {
  return (getPropDef(property).range * fuzzPercent) / 100;
};

export const getPropDef = (property: ColorPropKey): ColorPropDef => {
  return find(PROPERTIES, o => o.key === property);
};

export const getGetter = (property: ColorPropKey): ColorPropGetter => {
  return getPropDef(property).getter;
};

export const getColorProp = (color: Color, property: ColorPropKey): number => {
  return getGetter(property)(color);
};

export const getSetter = (property: ColorPropKey): ColorPropSetter => {
  return getPropDef(property).setter;
};

export const setColorProp = (
  color: Color,
  property: ColorPropKey,
  value: number
): Color => {
  return getSetter(property)(color, value);
};

//input should be anything that Color can use as an input to the Constructor
export const getGroupData = (
  colors: Array<number[] | string>
): GroupColorAnalysis => {
  const objects = colors.map(c => new Color(c));

  const pairs = PROPERTIES.map(o => [
    o.key,
    analyzePropertyValues(objects.map(o.getter))
  ]);

  return fromPairs(pairs) as GroupColorAnalysis;
};

export const mean = (values: number[]): number => {
  return values.reduce((a, c) => a + c) / values.length;
};

export const median = (values: number[]): number => {
  const sorted = [...values].sort();
  const i = values.length / 2;
  if (i % 1) {
    return (sorted[i + 0.5] + sorted[i - 0.5]) / 2;
  } else {
    return sorted[i];
  }
};

const analyzePropertyValues = (values: number[]): PropertyAnalysis => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const vMean = mean(values);
  const vMedian = median(values);
  const differences = values.map(v => Math.abs(v - vMean));
  return {
    values,
    min,
    max,
    spread: max - min,
    mean: vMean,
    median: vMedian,
    differences,
    meanDifference: mean(differences),
    medianDifference: median(values.map(v => Math.abs(v - vMedian)))
  };
};
