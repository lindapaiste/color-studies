import React, {ReactNode} from "react";

/**
 * should not need to copy this much HTML, but it works
 */
export interface Props {
    children?: ReactNode;
    label: ReactNode;
    padding?: number;
}

export const FormLabelWrapper = ({label, children, padding = 6}: Props) => (
    <div className="MuiFormControl-root MuiTextField-root"><label
        className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined MuiFormLabel-filled"
        data-shrink="true">{label}</label>
        <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl">
            <div style={{padding}}>{children}</div>
            <fieldset aria-hidden="true" className="PrivateNotchedOutline-root-1 MuiOutlinedInput-notchedOutline">
                <legend className="PrivateNotchedOutline-legendLabelled-3 PrivateNotchedOutline-legendNotched-4">
                    <span>{label}</span>
                </legend>
            </fieldset>
        </div>
    </div>
)
