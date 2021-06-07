import React from "react";
import { ChannelAdapter } from "logic/spacesChannels/ChannelAdapter";
import { allChannels, getChannel } from "logic/spacesChannels/channels";
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
