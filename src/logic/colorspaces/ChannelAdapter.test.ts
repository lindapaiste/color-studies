import { ChannelAdapter } from "./ChannelAdapter";
import { ModelAdapter } from "./ModelAdapter";

describe("ChannelAdapter", () => {
  it("Has the correct properties", () => {
    const rgbG = new ChannelAdapter("green", new ModelAdapter("rgb"), 1);
    expect(rgbG.min).toBe(0);
    expect(rgbG.max).toBe(255);
    expect(rgbG.offset).toBe(1);
    expect(rgbG.name).toBe("green");
    expect(rgbG.modelName).toBe("rgb");
    expect(rgbG.modelObject).toBeInstanceOf(ModelAdapter);
    expect(rgbG.isLooped).toBe(false);
    expect(rgbG.isVariable).toBe(false);
    expect(rgbG.key).toBe("rgb.g");
    expect(rgbG.slug).toBe("rgb.g");
    expect(rgbG.accessor).toEqual(["rgb", 1]);
    expect(rgbG.range).toBe(255);
    expect(rgbG.properName).toBe("Green");
    expect(rgbG.title).toBe("Green (RGB)");
  });

  it("Can validate and clamp based on the min and max", () => {
    const rgbG = new ChannelAdapter("green", new ModelAdapter("rgb"), 1);
    expect(rgbG.isValid(-10)).toBe(false);
    expect(rgbG.isValid(0)).toBe(true);
    expect(rgbG.isValid(100)).toBe(true);
    expect(rgbG.isValid(255)).toBe(true);
    expect(rgbG.isValid(256)).toBe(false);

    expect(rgbG.clamp(-10)).toBe(0);
    expect(rgbG.clamp(0)).toBe(0);
    expect(rgbG.clamp(100)).toBe(100);
    expect(rgbG.clamp(255)).toBe(255);
    expect(rgbG.clamp(256)).toBe(255);
  });

  it("Can clamp cyclical Hue channels", () => {
    const hue = new ChannelAdapter("hue", new ModelAdapter("hsl"), 0);
    expect(hue.clamp(0)).toBe(0);
    expect(hue.clamp(100)).toBe(100);
    expect(hue.clamp(-10)).toBe(350);
    expect(hue.clamp(-370)).toBe(350);
    // Note: the desired output for 720 could be 0 or 360.
    expect(hue.clamp(540)).toBe(180);
    expect(hue.clamp(900)).toBe(180);
  });
});
