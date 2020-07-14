import React, {ComponentType, FunctionComponent, useState} from "react";
import {I_ColorAdapter, randomColor} from "../../packages/color-adapter";
import {SelectColor} from "./SelectColor";

/**
 * for tools which are initialized with a random color,
 * but now can allow that color to be changed
 */


export const withSelectableColor = <P extends {color: I_ColorAdapter}>(Component: ComponentType<P>): FunctionComponent<Omit<P, 'color'>> =>
    (props) => {
        const [color, setColor] = useState(randomColor());

        return (
            <div>
                <div>
                    <div>Select Color:</div>
                    <SelectColor color={color} onChange={setColor}/>
                </div>
                <Component
                    {...{...props, color} as P}
                />
            </div>
        )
    };
