import React from "react";
import { ChannelAdapter } from "logic/colorspaces/ChannelAdapter";
import { allChannels, getChannel } from "logic/colorspaces/channels";
import { MultiSelect, UserProps } from "./MultiSelect";

export const MultiSelectChannel = (props: UserProps<ChannelAdapter>) => (
  <MultiSelect
    id="multi-select-channel"
    label="Channels"
    options={allChannels()}
    keyToObject={getChannel}
    {...props}
  />
);

export default MultiSelectChannel;
