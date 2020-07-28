import React from "react";
import {RandomIcon} from "../ui/Icons";
import {BaseField} from "./BaseField";
import {GenericProps, Size, WithoutE} from "./types";
import {IconTooltipButton} from "../ui/IconTooltipButton";
import {I_ColorAdapter} from "../../color/types";
import {hexToColor, randomColor} from "../../color";

/**
 * need to remove the second parameter e: ChangeEvent from the callback
 * so that it can be called by randomize button
 */
export type Props = Partial<Size> & WithoutE<GenericProps<I_ColorAdapter>> & {
    randomize?: boolean;
}

/**
 * uses HTML 5 color-picker input
 * can apply any CSS style properties to it
 * right now just passing width and height but leaving the borders
 *
 * previously had separate implementations for value formats hex and I_ColorAdapter
 * now just using I_ColorAdapter as the core
 */
export const SelectColor = React.forwardRef<HTMLDivElement, Props>(({value, onChange, width = 100, height = 40, randomize = false, ...props}, ref) => (
    <div ref={ref}>
        <BaseField
            {...props}
            value={value ? value.hex() : undefined}
            onChange={hex => onChange(hexToColor(hex))}
            inputProps={{
                type: "color",
                style: {
                    width,
                    height,
                    padding: 5
                }
            }}
        />
        {randomize &&
        <Randomize onChange={onChange}/>
        }
    </div>
)
);

/**
 * randomize icon button from prop onChange
 */
export const Randomize = ({onChange}: Pick<Props, 'onChange'>) => (
    <IconTooltipButton
        title={"Randomize Color"}
        icon={<RandomIcon/>}
        onClick={() => onChange(randomColor())}
    />
)
