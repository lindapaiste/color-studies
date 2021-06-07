import React from "react";
import { MenuItem as Option } from "@material-ui/core";
import { ChannelAdapter } from "logic/spacesChannels/ChannelAdapter";
import { allChannels, getChannel } from "logic/spacesChannels/channels";
import { Field } from "./Field";
import { GenericProps } from "./types";

/**
 * here, the channel object is the value
 * dom element uses the key, but look up from key on change
 */
export const SelectChannel = ({
  value,
  onChange,
  ...props
}: GenericProps<ChannelAdapter>) => (
  <Field
    label="Channel"
    {...props}
    select
    value={value ? value.key : undefined}
    onChange={(key, e) => onChange(getChannel(key), e)}
  >
    {allChannels().map((channel) => (
      <Option key={channel.key} value={channel.key}>
        {channel.title}
      </Option>
    ))}
  </Field>
);
