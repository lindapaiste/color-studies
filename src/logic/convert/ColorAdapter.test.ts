import { round } from "lib";
import { ColorAdapter } from "./ColorAdapter";

describe("ColorAdapter", () => {
  const mintGreen = new ColorAdapter("A9FEA7");

  it("can get individual channel values", () => {
    // check rounded values to make sure that the adapter can round
    expect(mintGreen.get("hsl.h", false, 0)).toEqual(119);
    expect(mintGreen.get("hsl.s", false, 0)).toEqual(98);
    expect(mintGreen.get("hsl.l", false, 0)).toEqual(83);
    // do the rounding with jest
    // check ALL the values for one color
    // used the adapter to get these test values, but useful for monitoring changes
    expect(mintGreen.get("hsi.h")).toBeCloseTo(119, 0);
    expect(mintGreen.get("hsi.s")).toBeCloseTo(15, 0);
    expect(mintGreen.get("hsi.i")).toBeCloseTo(77, 0);
    expect(mintGreen.get("hsv.h")).toBeCloseTo(119, 0);
    expect(mintGreen.get("hsv.s")).toBeCloseTo(34, 0);
    expect(mintGreen.get("hsv.v")).toBeCloseTo(100, 0);
    expect(mintGreen.get("lab.l")).toBeCloseTo(93, 0);
    expect(mintGreen.get("lab.a")).toBeCloseTo(-42, 0);
    expect(mintGreen.get("lab.b")).toBeCloseTo(34, 0);
    expect(mintGreen.get("lch.l")).toBeCloseTo(93, 0);
    expect(mintGreen.get("lch.c")).toBeCloseTo(54, 0);
    expect(mintGreen.get("lch.h")).toBeCloseTo(141, 0);
    expect(mintGreen.get("cmyk.c")).toBeCloseTo(33, 0);
    expect(mintGreen.get("cmyk.m")).toBeCloseTo(0, 0);
    expect(mintGreen.get("cmyk.y")).toBeCloseTo(34, 0);
    expect(mintGreen.get("cmyk.k")).toBeCloseTo(0, 0);
    expect(mintGreen.get("xyz.x")).toBeCloseTo(59, 0);
    expect(mintGreen.get("xyz.y")).toBeCloseTo(82, 0);
    expect(mintGreen.get("xyz.z")).toBeCloseTo(49, 0);
    expect(mintGreen.get("hwb.h")).toBeCloseTo(119, 0);
    expect(mintGreen.get("hwb.w")).toBeCloseTo(65, 0);
    expect(mintGreen.get("hwb.b")).toBeCloseTo(0, 0);
    expect(mintGreen.get("hcg.h")).toBeCloseTo(119, 0);
    expect(mintGreen.get("hcg.c")).toBeCloseTo(34, 0);
    expect(mintGreen.get("hcg.g")).toBeCloseTo(99, 0);
    expect(mintGreen.get("rgb.r")).toBeCloseTo(169, 0);
    expect(mintGreen.get("rgb.g")).toBeCloseTo(254, 0);
    expect(mintGreen.get("rgb.b")).toBeCloseTo(167, 0);
    expect(mintGreen.get("ryb.r")).toBeCloseTo(1, 0);
    expect(mintGreen.get("ryb.y")).toBeCloseTo(88, 0);
    expect(mintGreen.get("ryb.b")).toBeCloseTo(84, 0);
    expect(mintGreen.get("hsluv.h")).toBeCloseTo(127, 0);
    expect(mintGreen.get("hsluv.s")).toBeCloseTo(95, 0);
    expect(mintGreen.get("hsluv.l")).toBeCloseTo(93, 0);
    // skip HPLUV because this color does not exist in that colorspace -- too bright
  });

  it("can get normalized values", () => {
    expect(mintGreen.get("hsl.h", true)).toBeCloseTo(119 / 360, 2);
    expect(mintGreen.get("hsl.s", true)).toBeCloseTo(0.98, 2);
    expect(mintGreen.get("hsl.l", true)).toBeCloseTo(0.83, 2);
  });

  it("can covert between models", () => {
    expect(mintGreen.hex().toUpperCase()).toBe("#A9FEA7");
    expect(mintGreen.toCs("xyz").values.map((v) => round(v, 0))).toEqual([
      59, 82, 49,
    ]);
    expect(mintGreen.toCs("rgb").values.map((v) => round(v, 0))).toEqual([
      169, 254, 167,
    ]);
    expect(mintGreen.toCs("rgb")).toHaveLength(3);
    // not implementing all because already checked every channel
  });
});
