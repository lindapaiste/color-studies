import React, {ComponentType, FunctionComponent, useState} from "react";
import {I_ColorAdapter, randomColor} from "../../packages/color-adapter";
import {SelectColor} from "./SelectColor";
import debounce from "lodash/debounce";
import {makeArray, removeIndex, replaceIndex} from "../../util";

/**
 * works the same way as withSelectableColor, but for an array of colors instead of just one
 */
export const withSelectMultipleColors = <P extends {colors: I_ColorAdapter[]}>(Component: ComponentType<P>, initialCount: number = 3, isFixedCount: boolean = false): FunctionComponent<Omit<P, 'colors'>> =>
    (props) => {
        const [colors, setColors] = useState(makeArray( initialCount, randomColor ));

        const onAdd = () => {
            setColors([...colors, randomColor()]);
        };

        const onRemove = (i: number) => () => setColors(removeIndex(colors, i));

        const onChange = (i: number) => debounce((c) => {setColors(replaceIndex(colors, i, c))}, 250, { trailing: true });

        return (
            <div>
                <div>
                    <div>Select Colors:</div>
                    {colors.map( (color, i) => (
                        <div key={i}>
                        <SelectColor color={color} onChange={onChange(i)}/>
                            {isFixedCount ||
                            <span onClick={onRemove(i)}>x</span>
                            }
                        </div>
                    ))}
                    { isFixedCount ||
                        <span onClick={onAdd}>+</span>
                    }
                </div>
                <Component
                    {...{...props, colors} as P}
                />
            </div>
        )
    };
