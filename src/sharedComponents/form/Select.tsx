import React from "react";
import { BaseProps, BaseField } from "./BaseField";

/**
 * this version of Select is just a wrapper that takes options as children
 */

export const Select = (props: BaseProps) => <BaseField select {...props} />;
