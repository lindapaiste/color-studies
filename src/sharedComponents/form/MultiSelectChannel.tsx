import {GenericProps, WithoutE} from "./types";
import {Checkbox, Chip, FormControl, InputLabel, ListItemText, MenuItem, Select} from "@material-ui/core";
import React from "react";
import CheckboxInput from "./CheckboxInput";
import ChannelAdapter from "../../spacesChannels/ChannelAdapter";
import {allChannels, getChannelFromKey} from "../../spacesChannels/channels";

/**
 * is extremely similar to MultiSelectModel -- perhaps they can share a base MultiSelect Component
 */

export type Props = WithoutE<GenericProps<ChannelAdapter[]>> & {
    selectAll?: boolean;
}

export const MultiSelectChannel = ({value, onChange, label = "Channels", selectAll = true, ...props}: Props) => {
    const selectedKeys = (value || []).map(channel => channel.key);

    //could lookup model in renderValue rather than using toUpperCase
    return (
        <div style={{display: "flex"}}>
            <FormControl>
                <InputLabel id="multi-select-channel">{label}</InputLabel>
                <Select
                    {...props}
                    multiple={true}
                    label={label}
                    labelId="multi-select-channel"
                    value={selectedKeys}
                    variant="outlined"
                    onChange={(e) => onChange((e.target.value as string[] || []).map(getChannelFromKey))}
                    renderValue={(keys) => (
                        <div>
                            {(keys as string []).map(key => (
                                <Chip key={key} label={getChannelFromKey(key).title}/>
                            ))}
                        </div>
                    )}
                    style={{
                        minWidth: 175,
                        flex: 1,
                    }}
                >
                    {allChannels().map(channel => (
                        <MenuItem key={channel.key} value={channel.key}>
                            <Checkbox checked={selectedKeys.indexOf(channel.key) > -1}/>
                            <ListItemText primary={channel.title}/>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {selectAll &&
            <CheckboxInput
                label={"Select All"}
                value={value?.length === allChannels().length}
                onChange={(checked) => {
                    if (checked) {
                        onChange(allChannels());
                    } else {
                        onChange([]);
                    }
                }}
            />
            }
        </div>
    )
};

export default MultiSelectChannel;
