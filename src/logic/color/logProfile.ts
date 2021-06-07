import { IColorAdapter } from "./types";
import { eitherToColor } from "./index";
import { allChannels } from "../spacesChannels/channels";

export const logProfile = (color: IColorAdapter | string): void => {
  // use try catch because not all strings are valid colors
  try {
    const object = eitherToColor(color);
    const profile = Object.fromEntries(
      allChannels().map((channel) => [channel.key, object.get(channel)])
    );
    // could also use alert here - alert allows \t and \n but not html
    console.log(profile);
  } catch (e) {
    console.log(e);
  }
};
