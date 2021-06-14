import { rgbToRyb, rybToRgb } from "./ryb";

test("magenta from [1,0,1] RGB to [1,0,0.5] RYB", () => {
  expect(rgbToRyb([1, 0, 1], 1)).toEqual([1, 0, 0.5]);
});

test("purple from [127.5,0,255] RGB to [255, 0, 255] RYB", () => {
  expect(rgbToRyb([127.5, 0, 255], 255)).toEqual([255, 0, 255]);
});

test("purple from [.5,0,1] RGB to [1, 0, 1] RYB", () => {
  expect(rgbToRyb([0.5, 0, 1], 1)).toEqual([1, 0, 1]);
});

test("green from [0,1,1] RYB to [0,1,0] RGB", () => {
  expect(rybToRgb([0, 1, 1], 1)).toEqual([0, 1, 0]);
});

test("yellow from [0,255,0] RYB to [255,255,0] RGB", () => {
  expect(rybToRgb([0, 255, 0], 255)).toEqual([255, 255, 0]);
});
