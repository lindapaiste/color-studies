import React, { useState } from "react";
import { GROUPINGS } from "./data";
import { PROPERTIES, getGetter, ColorPropKey } from "./analyzeColors";
import { VisualHistogram } from "./VisualHistogram";
import { find } from "lodash";
//import {Select} from "@material-ui/core";

export const HistogramCreator = () => {
  //alternatively, could use HTML data attributes to get and store the whole object rather than just the name
  const [group, setGroup] = useState<string | null>(null);
  const [property, setProperty] = useState<ColorPropKey | null>(null);
  const [count, setCount] = useState(6);

  return (
    <div>
      <div>
        <select value={group} onChange={e => setGroup(e.target.value)}>
          {GROUPINGS.map(o => (
            <option value={o.name}>{o.name}</option>
          ))}
        </select>

        <select
          value={property}
          onChange={e => setProperty(e.target.value as ColorPropKey)}
        >
          {PROPERTIES.map(o => (
            <option value={o.key}>{o.key}</option>
          ))}
        </select>
        <input
          type="number"
          value={count}
          onChange={e => setCount(parseInt(e.target.value, 10))}
        />
      </div>
      {group !== null && property !== null && (
        <VisualHistogram
          getProperty={getGetter(property)}
          colors={find(GROUPINGS, o => o.name === group).hexes}
          breakpoints={count}
          colorSize={50}
        />
      )}
    </div>
  );
};
