import React from "react";
import "./styles.css";
import { RenderColor } from "../RenderColor";
import Color from "color";
import { randomRgb } from "../rgb";
import { GROUPINGS, PropertyConstraint } from "./data";
import { getColorProp, setColorProp, ColorPropKey } from "./analyzeColors";
import { last } from "lodash";
import { fitsConditions } from "./colorToGroup";

/**
 * play with rgb(47, 60, 14) going to pastel
 * or (141, 136, 196)
 */
export const Temp = () => {
  const color = Color("rgb(47, 60, 14)");
  const group = GROUPINGS[1];
  console.log(group.name);
  return (
    <div>
      <h3>{group.name}</h3>
      <ForceToRules color={color} rules={group.definitions} />
    </div>
  );
};

export const Test = () => {
  const random = Color.rgb(randomRgb());

  return (
    <div>
      {GROUPINGS.map(group => {
        console.log(group.name);
        return (
          <div>
            <h3>{group.name}</h3>
            <ForceToRules color={random} rules={group.definitions} />
          </div>
        );
      })}
    </div>
  );
};

export const ForceToRules = ({
  color,
  rules = [],
  maxAttempts = 10,
  fuzzPercent = 0.1
}: {
  color: Color;
  rules: PropertyConstraint[];
  maxAttempts?: number;
  fuzzPercent?: number;
}) => {
  const phases: Array<{ color: Color; property: ColorPropKey | null }> = [
    { color, property: null }
  ];

  for (let i = 0; i < maxAttempts; i++) {
    const errors = fitsConditions(
      last(phases).color,
      rules,
      false,
      fuzzPercent
    );
    console.log(errors);
    if (errors.matches) {
      console.log("Color Okay!");
      break;
    }

    rules.forEach(({ property, min, max }) => {
      const initial = last(phases).color;
      const value = getColorProp(initial, property);
      if (value > max) {
        const color = setColorProp(initial, property, max);
        phases.push({ color, property });
        console.log("set " + property + " to " + max);
      } else if (value < min) {
        const color = setColorProp(initial, property, value);
        phases.push({ color, property });
        console.log("set " + property + " to " + min);
      } else {
        console.log(property + " ok");
      }
    });
  }

  return (
    <div>
      {phases.map(({ color, property }, i) => (
        <div key={i}>
          <h3>Edited {property}</h3>
          <RenderColor color={color} />
        </div>
      ))}
    </div>
  );
};
