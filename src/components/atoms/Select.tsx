import React from "react";
import { FieldProps, Field } from "./Field";

/**
 * this version of Select is just a wrapper that takes options as children
 */

export const Select = (props: FieldProps) => <Field select {...props} />;
