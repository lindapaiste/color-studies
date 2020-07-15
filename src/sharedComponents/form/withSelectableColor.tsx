import React, {ComponentType, FunctionComponent, useState} from "react";
import {I_ColorAdapter, randomColor} from "../../packages/color-adapter";
import {SelectColor} from "./SelectColor";
import debounce from "lodash/debounce";

/**
 * for tools which are initialized with a random color,
 * but now can allow that color to be changed
 */


/**
 * need to debounce/throttle the color being being passed down
 * because it can change rapidly when dragging
 * and wrapped component may have expensive operations dependent on color
 */

export const withSelectableColor = <P extends {color: I_ColorAdapter}>(Component: ComponentType<P>): FunctionComponent<Omit<P, 'color'>> =>
    (props) => {
        const [color, setColor] = useState(randomColor());
        //const [cachedColor, setCachedColor] = useState(randomColor());

        const onChange = debounce(setColor, 250, { trailing: true });

        return (
            <div>
                <div>
                    <div>Select Color:</div>
                    <SelectColor color={color} onChange={onChange}/>
                </div>
                <Component
                    {...{...props, color} as P}
                />
            </div>
        )
    };
