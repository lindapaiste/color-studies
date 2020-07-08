import { RGB } from "./util";

export const randomRgb = (): RGB => [
  255 * Math.random(),
  255 * Math.random(),
  255 * Math.random()
];
