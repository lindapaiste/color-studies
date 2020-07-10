import {useGenericInput} from "./sharedComponents/form/useGenericInput";
import {randomHex} from "./util";
import React from "react";
import {RenderColorInfo} from "./sharedComponents/color/RenderColorInfo";

/**
 * uses HTML 5 color-picker input
 */
export const ColorInfoTool = () => {
    const [hex, Input] = useGenericInput(randomHex());

    return (
        <div>
            <Input type="color"/>
            <RenderColorInfo color={hex}/>
        </div>
    )
};
