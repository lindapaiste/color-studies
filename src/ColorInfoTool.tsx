import {randomHex} from "./util";
import React, {useState} from "react";
import {RenderColorInfo} from "./sharedComponents/color/RenderColorInfo";
import {SelectHex} from "./sharedComponents/form/SelectColor";
import {ColorAdapter} from "./packages/color-adapter";

/**
 * uses HTML 5 color-picker input
 */
export const ColorInfoTool = () => {
    const [hex, setHex] = useState(randomHex());

    return (
        <div>
            <SelectHex color={hex} onChange={setHex}/>
            <RenderColorInfo color={new ColorAdapter(hex)}/>
        </div>
    )
};
