import { deNormalize, normalize } from "./channelMaxes";

test("deNormalize 0.5 to 180 hue", () => {
  expect(deNormalize(0.5, "hue")).toBe(180);
});

test("normalize 90 hue to 0.25", () => {
  expect(normalize(90, "hue")).toBe(0.25);
});
