import React from "react";
import { Event, GenericProps } from "./types";
import { BaseField } from "./BaseField";
import { Option } from "./Option";
import { allGroups, getGroup } from "../../grouping";
import { ColorGrouping } from "../../grouping/ColorGrouping";

/**
 * primarily for selecting the group name, but passes the whole group object as second arg to onChange
 * not really necessary, it isn't actually used anywhere
 */

export interface Props {
  value: string | undefined | null;

  onChange(name: string, group: ColorGrouping, e: Event): void;
}

export const SelectGroup = ({
  value,
  onChange,
  label = "Grouping",
  ...props
}: Props & Omit<GenericProps<string>, "onChange">) => (
  <BaseField
    {...props}
    select
    label={label}
    value={value || ""}
    onChange={(name, e) => {
      const object = getGroup(name);
      if (object) {
        onChange(name, object, e);
      }
    }}
  >
    {allGroups().map((o) => (
      <Option key={o.name} value={o.name}>
        {o.name}
      </Option>
    ))}
  </BaseField>
);
