import { ModelAdapter } from "./ModelAdapter";

test("can normalize RGB", () => {
  const rgb = new ModelAdapter("rgb");
  const [r, g, b] = rgb.normalize([0, 127, 255]);
  expect(r).toEqual(0);
  expect(g).toEqual(0.5);
  expect(b).toEqual(1);
});

test("can de-normalize RGB", () => {
  const rgb = new ModelAdapter("rgb");
  const [r, g, b] = rgb.normalize([0, 0.5, 1]);
  expect(r).toEqual(0);
  expect(g).toEqual(127);
  expect(b).toEqual(255);
});

test("can normalize HSL", () => {
  const hsl = new ModelAdapter("hsl");
  const [h, s, l] = hsl.normalize([90, 25, 75]);
  expect(h).toEqual(0.25);
  expect(s).toEqual(0.25);
  expect(l).toEqual(0.75);
});

test("can de-normalize HSL", () => {
  const hsl = new ModelAdapter("hsl");
  const [h, s, l] = hsl.deNormalize([0.25, 0.25, 0.75]);
  expect(h).toEqual(90);
  expect(s).toEqual(25);
  expect(l).toEqual(75);
});
