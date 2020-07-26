import {BaseProps, BaseField} from "./BaseField";
import React from "react";

/**
 * this version of Select is just a wrapper that takes options as children
 */

export const Select = (props: BaseProps) => <BaseField select {...props}/>
