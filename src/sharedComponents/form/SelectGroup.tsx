import { ColorClassification } from "../../grouping/types";
import { getFromName, GROUPINGS } from "../../grouping/group-data";
import React from "react";
import { GenericProps, Event } from "./types";
import { BaseField } from "./BaseField";
import { Option } from "./Option";

/**
 * primarily for selecting the group name, but passes the whole group object as second arg to onChange
 * not really necessary, it isn't actually used anywhere
 */

export interface Props {
  value: string | undefined | null;
  onChange(name: string, group: ColorClassification, e: Event): void;
}

export const SelectGroup = ({
  value,
  onChange,
  label = "Grouping",
  ...props
}: Props & Omit<GenericProps<string>, "onChange">) => {
  return (
    <BaseField
      {...props}
      select
      label={label}
      value={value || ""}
      onChange={(name, e) => {
        const object = getFromName(name);
        if (object) {
          onChange(name, object, e);
        }
      }}
    >
      {GROUPINGS.map(o => (
        <Option key={o.name} value={o.name}>
          {o.name}
        </Option>
      ))}
    </BaseField>
  );
};
