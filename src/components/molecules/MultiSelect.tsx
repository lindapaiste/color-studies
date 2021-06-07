import React, { ReactNode } from "react";
import {
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@material-ui/core";
import { ifDefined } from "lib";
import { GenericProps } from "../atoms/types";
import { CheckboxInput, FlexRow } from "../atoms";

/**
 * any object with a key and title can fit the interface of an option
 */
export interface Option {
  key: string;
  title: string;
}

export type Props<T extends Option> = GenericProps<T[], any> & {
  label: ReactNode; // require label
  id?: string; // specific children will pass this
  options: T[];
  showSelectAll?: boolean; // this is whether or not to show the select all, not whether or not it's checked
  keyToObject?(key: string): T;
};

/**
 * props for the specific components to take in
 * props such as id and options are expected to be set by the component rather than coming from props
 */
export type UserProps<T extends Option> = GenericProps<T[], any> &
  Pick<Props<T>, "showSelectAll">;

export const MultiSelect = <T extends Option>({
  value,
  onChange,
  showSelectAll = true,
  options,
  label,
  id = "multi-select",
  keyToObject,
  ...props
}: Props<T>) => {
  const selectedKeys = (value || []).map((object) => object.key);

  // can pass a keyToObject prop, but can also use find() on the array of options
  const getObject = ifDefined(
    keyToObject,
    (key: string) => options.find((o) => o.key === key) as T
  );

  return (
    <div style={{ display: "flex" }}>
      <FormControl>
        <InputLabel id={id}>{label}</InputLabel>
        <Select
          {...props}
          multiple
          label={label}
          labelId={id}
          value={selectedKeys}
          variant="outlined"
          onChange={(e) =>
            onChange(((e.target.value as string[]) || []).map(getObject), e)
          }
          renderValue={(keys) => (
            <FlexRow wrap>
              {(keys as string[]).map(getObject).map((object) => (
                <Chip key={object.key} label={object.title} />
              ))}
            </FlexRow>
          )}
          style={{
            minWidth: 175,
            flex: 1,
          }}
        >
          {options.map((object) => (
            <MenuItem key={object.key} value={object.key}>
              <Checkbox checked={selectedKeys.indexOf(object.key) > -1} />
              <ListItemText primary={object.title} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {showSelectAll && (
        <CheckboxInput
          label="Select All"
          value={value?.length === options.length}
          onChange={(checked, e) => {
            if (checked) {
              onChange(options, e);
            } else {
              onChange([], e);
            }
          }}
        />
      )}
    </div>
  );
};
