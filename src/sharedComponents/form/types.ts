import {ChangeEvent, CSSProperties, FunctionComponent, ReactNode} from "react";
import { TextFieldProps } from "@material-ui/core/TextField";

export type UseFormTuple<T, P = {}> = [T, FunctionComponent<P>];

/**
 * want to allow for some amount of formatting and labeling,
 * but don't want the tools themselves to be coupled to Material UI
 * that coupling should be limited to these form components
 * so minimize the pass-through props from specific components
 */

/**
 * props used by Components who pass down data in a any format
 * all inputs receive a value
 * and call onChange with the new value and the event as a secondary prop
 * don't want to rely on a specific HTML element because the implementation could use a different one
 */
export interface GenericProps<T> {
  value: T | undefined;
  onChange(value: T, e: Event): void;
  label?: ReactNode;
  helperText?: ReactNode;
  disabled?: boolean;
  style?: CSSProperties;
  width?: number;
}

export type Event = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

/**
 * removes the second param -- the event -- from onChange
 * so that onChange can be called from another event or from no event
 */
export type WithoutE<P> = P extends GenericProps<infer T>
  ? Omit<P, "onChange"> & { onChange(value: T): void }
  : P;

/**
 * adds all of the props from the Material component, removing any conflicts
 * partial is mainly needed here to make variant not required
 */
export type WithTextFieldProps<T> = T & Omit<Partial<TextFieldProps>, keyof T>;

/**
 * interface for using options with any sort of type-cast or complex data
 */
export interface Option<T> {
  key: string;
  raw: T;
  title: string;
}

export interface Size {
  width: number;
  height: number;
}
