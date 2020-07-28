import React from "react";
import {ColorInfo} from "../../sharedComponents/color/ColorInfo";
import {GROUPINGS} from "../../grouping/group-data";
import {last} from "lodash";
import {fitsConditions} from "../../grouping/colorToGroup";
import {PropertyConstraint} from "../../grouping/types";
import {Swatch} from "../../sharedComponents/color/Swatch";
import {ColorAdapter} from "../../color/ColorAdapter";
import {nameToAccessor} from "../../spacesChannels/accessorConversion";
import {ChannelName} from "../../spacesChannels/types";
import {I_ColorAdapter, PropColor} from "../../color/types";

/**
 * play with rgb(47, 60, 14) going to pastel
 * or (141, 136, 196)
 */
export const Temp = () => {
    const color = new ColorAdapter("rgb(47, 60, 14)");
    const group = GROUPINGS[1];
    console.log(group.name);
    return (
        <div>
            <h3>{group.name}</h3>
            <ForceToRules color={color} rules={group.definitions}/>
        </div>
    );
};

export const ForceToAll = ({color}: PropColor) => {
    return (
        <div>
            {GROUPINGS.map(group => {
                return (
                    <div>
                        <h3>{group.name}</h3>
                        <ForceToRules color={color} rules={group.definitions}/>
                    </div>
                );
            })}
        </div>
    );
};

export interface Props {
    color: I_ColorAdapter;
    rules?: PropertyConstraint[];
    maxAttempts?: number;
    fuzz?: number;
}

export const ForceToRules = ({
                                 color,
                                 rules = [],
                                 maxAttempts = 10,
                                 fuzz = 0.1
                             }: Props) => {
    const phases: Array<{ color: I_ColorAdapter; property: ChannelName | null }> = [
        {color, property: null}
    ];

    for (let i = 0; i < maxAttempts; i++) {
        const errors = fitsConditions(
            // @ts-ignore
            last(phases).color,
            rules,
            false,
            fuzz
        );
        console.log(errors);
        if (errors.matches) {
            console.log("Color Okay!");
            break;
        }

        rules.forEach(({property, min, max}) => {
            const channel = nameToAccessor(property);
            const initial = last(phases)?.color;
            if ( ! initial ) return;
            const value = initial.get(channel);
            if (value > max) {
                const color = initial.set(channel, max);
                phases.push({color, property});
                console.log("set " + property + " to " + max);
            } else if (value < min) {
                const color = initial.set(channel, value);
                phases.push({color, property});
                console.log("set " + property + " to " + min);
            } else {
                console.log(property + " ok");
            }
        });
    }

    return (
        <div>
            {phases.map(({color, property}, i) => (
                <div key={i}>
                    <h3>Edited {property}</h3>
                    <Swatch color={color} size={100}/>
                    <ColorInfo color={color} initialOpen={false}/>
                </div>
            ))}
        </div>
    );
};
