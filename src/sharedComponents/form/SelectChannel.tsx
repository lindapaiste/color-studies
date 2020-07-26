import React from "react";
import {BaseField} from "./BaseField";
import {GenericProps} from "./types";
import {Option} from "./Option";
import {ChannelAdapter} from "../../spacesChannels/ChannelAdapter";
import {allChannels, getChannelFromKey} from "../../spacesChannels/channels";

/**
 * here, the channel object is the value
 * dom element uses the key, but look up from key on change
 */
export const SelectChannel = ({value, onChange, ...props}: GenericProps<ChannelAdapter>) => (
    <BaseField
        label="Channel"
        {...props}
        select
        value={value ? value.key : undefined}
        onChange={(key, e) => onChange(getChannelFromKey(key), e)}
    >
        {allChannels().map(channel => (
            <Option key={channel.key} value={channel.key}>
                {channel.title}
            </Option>
        ))}
    </BaseField>
);
