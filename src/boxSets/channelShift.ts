import chroma, {Scale} from "chroma-js";

export const channelShift = (channel: string, shift: number, max: number): Scale => {
    const color = chroma.random();
    const initial = color.get(channel);
    //this needs to be tweaked it shift is more than half the max
    const shifted = color.set(channel, initial + shift > max ? initial - shift: initial + shift);
    console.log({color, shifted});
    return chroma.scale([color, shifted]);
};
