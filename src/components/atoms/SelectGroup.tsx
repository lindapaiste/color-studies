import React from "react";
import { MenuItem as Option } from "@material-ui/core";
import { ColorGrouping } from "logic/classification/constraints/ColorGrouping";
import { allGroups, NameAndHexes } from "data";
import { getColorGrouping } from "logic/classification/constraints/getGroup";
import { Event, GenericProps } from "./types";
import { Field } from "./Field";

/**
 * Primarily for selecting the group name.
 * Can also pass a group object as value.
 * Passes the whole group object as second arg to onChange
 * but this is not really necessary, it isn't actually used anywhere.
 */

export interface Props {
  value: string | NameAndHexes | undefined | null;

  onChange(name: string, group: ColorGrouping, e: Event): void;
}

const stringValue = (value: Props["value"]): string =>
  typeof value === "string" ? value : value?.name ?? "";

export const SelectGroup = ({
  value,
  onChange,
  label = "Grouping",
  ...props
}: Props & Omit<GenericProps<string>, "onChange">) => (
  <Field
    {...props}
    select
    label={label}
    value={stringValue(value)}
    onChange={(name, e) => {
      const object = getColorGrouping(name);
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
  </Field>
);
