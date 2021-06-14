import React from "react";
import { allChannels, ChannelAdapter, getChannel } from "logic";
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
