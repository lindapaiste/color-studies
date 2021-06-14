import { ColorAdapter } from "../convert";
import { ChannelGradient } from "./ChannelGradient";
import { getChannel } from "../colorspaces";

describe("ChannelGradient", () => {
  it("can create a gradient of colors", () => {
    const gradient = new ChannelGradient({
      initial: ColorAdapter.staticFrom([100, 100, 100], "hsl"),
      channel: getChannel("hsl.s"),
    });

    const colors = gradient.colors(5);
    expect(colors.map((c) => c.get("hsl.s"))).toEqual([0, 25, 50, 75, 100]);
  });

  it("can support custom start and end points", () => {
    const gradient = new ChannelGradient({
      initial: ColorAdapter.staticFrom([100, 100, 100], "hsl"),
      channel: getChannel("hsl.s"),
      start: 50,
      end: 200,
    });

    const colors = gradient.colors(4);
    expect(colors.map((c) => c.get("hsl.s"))).toEqual([50, 100, 150, 200]);
  });

  it("can support transformations", () => {
    const gradient = new ChannelGradient({
      initial: ColorAdapter.staticFrom([100, 100, 100], "hsl"),
      channel: getChannel("hsl.s"),
      transform: {
        pre: (v) => v ** 2,
        post: (v) => v ** 0.5,
      },
    });

    const middle = (100 ** 2 / 2) ** 0.5;
    const colors = gradient.colors(3);
    expect(colors.map((c) => c.get("hsl.s"))).toEqual([0, middle, 100]);
  });
});
