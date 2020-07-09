import React, { useState } from "react";
import {getFromName, GROUPINGS} from "../grouping/group-data";
import { VisualHistogram } from "./VisualHistogram";
import {ColorPropDef, ColorPropKey} from "../properties/types";
import {getGetter, propertyKeys, getTitle, Color} from "../properties";
import {ColorClassification} from "../grouping/types";
//import {Select} from "@material-ui/core";

/**
 * tool which allows me to interactively create property histograms for any of the stored color groupings
 */
export const HistogramTool = () => {
  //alternatively, could use HTML data attributes to get and store the whole object rather than just the name
  const [group, setGroup] = useState<ColorClassification | undefined>();
  const [property, setProperty] = useState<ColorPropKey | undefined>();
  const [count, setCount] = useState(6);

  return (
    <div>
      <div>
        <SelectGroup
            name={group? group.name : undefined}
            onChange={setGroup}
        />
        <SelectProperty
            key={property}
            onChange={setProperty}
        />
        <NumberInput
            value={count}
            onChange={setCount}
        />
      </div>
      {group !== undefined && property !== undefined && (
        <VisualHistogram
            getProperty={getGetter(property)}
            hexes={group.hexes}
            breakpoints={count}
            colorSize={50}
        />
      )}
    </div>
  );
};

export const SelectGroup = ({name, onChange}: {name: string | undefined | null, onChange: (group: ColorClassification) => void}) => {
    return (
        <select value={name || ''} onChange={e => {
            const object = getFromName(e.target.value);
            if ( object ) {
                onChange( object );
            }
        }}>
            {GROUPINGS.map(o => (
                <option value={o.name}>{o.name}</option>
            ))}
        </select>
    )
};

export const SelectProperty = ({key, onChange}: {key: ColorPropKey | undefined | null, onChange: (key: ColorPropKey) => void}) => (
    <select
        value={key || ''}
        onChange={e => onChange(e.target.value as ColorPropKey)}
    >
        {propertyKeys.map(key => (
            <option value={key}>{getTitle(key)}</option>
        ))}
    </select>
);


export const NumberInput = ({value, onChange}: {value: number, onChange: (n: number) => void}) => (
    <input
        type="number"
        value={value}
        onChange={e => onChange(parseInt(e.target.value, 10))}
    />
);
