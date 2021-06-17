import React from "react";
import { CheckCircle, ErrorOutline } from "@material-ui/icons";
import {
  Accordion,
  ExpandableColorInfo,
  Swatch,
  Title,
  withSelectableColor,
} from "components";
import { allGroupNames } from "data";
import { getColorGrouping } from "logic/classification/constraints/getGroup";
import { forceColor } from "logic/classification/constraints/forceColor";
import { ColorAdapter } from "logic";

// TODO: the order of rules matters -- how to control this?

export const ForceToAll = ({ color }: { color: ColorAdapter }) => (
  <div>
    <Title importance="h3">Initial Color</Title>
    <Swatch color={color} size={100} />
    {allGroupNames().map((name) => {
      const group = getColorGrouping(name);
      const result = forceColor({ color, rules: group.definitions });
      return (
        <div key={name}>
          <Title importance="h3">
            As: {name} {result.passed ? <CheckCircle /> : <ErrorOutline />}
          </Title>
          <Swatch color={result.color} size={100} />
          <Accordion title="Details">
            {result.phases.map(
              ({ color: modifiedColor, channel, message }, i) => (
                // Note: cannot use hex as key because hexes are ofter not unique
                // in the case of an impossible forcing where it goes back and forth between the same steps
                // eslint-disable-next-line react/no-array-index-key
                <div key={i}>
                  <Title importance="h4">Edited {channel.title}</Title>
                  <Title importance="h5">{message}</Title>
                  <Swatch color={modifiedColor} size={300} height={30} />
                  <ExpandableColorInfo
                    color={modifiedColor}
                    initialOpen={false}
                  />
                </div>
              )
            )}
            <Title importance="h4">
              {result.passed ? "Passed" : "Still Failed"}
            </Title>
          </Accordion>
        </div>
      );
    })}
  </div>
);

export default withSelectableColor(ForceToAll);
