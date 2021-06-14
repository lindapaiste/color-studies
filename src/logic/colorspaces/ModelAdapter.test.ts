import { ModelAdapter } from "./ModelAdapter";
import { ChannelAdapter } from "./ChannelAdapter";

describe("ModelAdapter", () => {
  it("can normalize RGB", () => {
    const rgb = new ModelAdapter("rgb");
    const [r, g, b] = rgb.normalize([0, 127.5, 255]);
    expect(r).toEqual(0);
    expect(g).toEqual(0.5);
    expect(b).toEqual(1);
  });

  it("can de-normalize RGB", () => {
    const rgb = new ModelAdapter("rgb");
    const [r, g, b] = rgb.deNormalize([0, 0.5, 1]);
    expect(r).toEqual(0);
    expect(g).toEqual(127.5);
    expect(b).toEqual(255);
  });

  it("can normalize HSL", () => {
    const hsl = new ModelAdapter("hsl");
    const [h, s, l] = hsl.normalize([90, 25, 75]);
    expect(h).toEqual(0.25);
    expect(s).toEqual(0.25);
    expect(l).toEqual(0.75);
  });

  it("can de-normalize HSL", () => {
    const hsl = new ModelAdapter("hsl");
    const [h, s, l] = hsl.deNormalize([0.25, 0.25, 0.75]);
    expect(h).toEqual(90);
    expect(s).toEqual(25);
    expect(l).toEqual(75);
  });

  it("can access channels", () => {
    const rgb = new ModelAdapter("rgb");
    const [r, g, b] = rgb.channels;
    expect(r).toBeInstanceOf(ChannelAdapter);
    expect(g).toBeInstanceOf(ChannelAdapter);
    expect(b).toBeInstanceOf(ChannelAdapter);
    // not testing detailed properties of the channel, do that in the ChannelAdapter test
  });

  it("has the correct channel count", () => {
    const rgb = new ModelAdapter("rgb");
    expect(rgb.channelCount).toBe(3);
    expect(rgb.channels).toHaveLength(3);
    const cmyk = new ModelAdapter("cmyk");
    expect(cmyk.channelCount).toBe(4);
    expect(cmyk.channels).toHaveLength(4);
  });
});
