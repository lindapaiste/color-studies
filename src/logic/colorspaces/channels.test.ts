import {
  getChannel,
  randomChannel,
  toChannelAccessor,
  toChannelIndex,
  toChannelObject,
} from "./channels";
import { ChannelAdapter } from "./ChannelAdapter";
import { ChannelAccessor } from "./types";

describe("channels", () => {
  it("can get a random channel", () => {
    expect(randomChannel()).toBeInstanceOf(ChannelAdapter);
  });

  it("can find the correct channel", () => {
    const c = getChannel("hsl.s");
    expect(c).toBeInstanceOf(ChannelAdapter);
    expect(c.slug).toBe("hsl.s");
    expect(c.name).toBe("saturation");
  });

  it("can convert between channel types", () => {
    const index = 1;
    const accessor: ChannelAccessor = ["hsl", 1];
    const slug = "hsl.s";
    const adapter = getChannel(slug);
    // to index
    expect(toChannelIndex(index)).toBe(1);
    expect(toChannelIndex(accessor)).toBe(1);
    expect(toChannelIndex(slug)).toBe(1);
    expect(toChannelIndex(adapter)).toBe(1);
    // to accessor
    expect(toChannelAccessor(accessor)).toEqual(accessor);
    expect(toChannelAccessor(slug)).toEqual(accessor);
    expect(toChannelAccessor(adapter)).toEqual(accessor);
    // to adapter
    expect(toChannelObject(accessor)).toBeInstanceOf(ChannelAdapter);
    expect(toChannelObject(slug)).toBeInstanceOf(ChannelAdapter);
    expect(toChannelObject(adapter)).toBeInstanceOf(ChannelAdapter);
  });
});
