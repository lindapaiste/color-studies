import React from "react";
import { last } from "lodash";
import { ColorInfo } from "../../sharedComponents/color/ColorInfo";
import { Swatch } from "../../sharedComponents/color/Swatch";
import { ColorAdapter } from "../../color/ColorAdapter";
import { I_ColorAdapter, PropColor } from "../../color/types";
import { allGroups, randomGroup } from "../../grouping";
import { ColorGrouping } from "../../grouping/ColorGrouping";
import ChannelAdapter from "../../spacesChannels/ChannelAdapter";
import { Title } from "../../sharedComponents/ui/Title";
import PropertyConstraint from "../../grouping/PropertyConstraint";

/**
 * play with rgb(47, 60, 14) going to pastel
 * or (141, 136, 196)
 */
export const Temp = () => {
  const color = new ColorAdapter("rgb(47, 60, 14)");
  const group = randomGroup();
  console.log(group.name);
  return (
    <div>
      <h3>{group.name}</h3>
      <ForceToRules color={color} group={group} />
    </div>
  );
};

export const ForceToAll = ({ color }: PropColor) => {
  return (
    <div>
      {allGroups().map((group) => {
        return (
          <div>
            <Title importance="h3">{group.name}</Title>
            <ForceToRules color={color} group={group} />
          </div>
        );
      })}
    </div>
  );
};

export interface Props {
  color: I_ColorAdapter;
  group: ColorGrouping;
  maxAttempts?: number;
  fuzz?: number;
}

export const ForceToRules = ({
  color,
  group,
  maxAttempts = 10,
  fuzz = 0.1,
}: Props) => {
  const phases: Array<{
    color: I_ColorAdapter;
    channel: ChannelAdapter | null;
  }> = [{ color, channel: null }];

  const applyRule = (cond: PropertyConstraint) => {
    const channel = cond.channel;
    const property = cond.channel.name;
    const initial = last(phases)?.color;
    if (!initial) return;
    const value = initial.get(channel, true);
    if (value > cond.max) {
      const color = initial.set(channel, cond.max, true);
      phases.push({ color, channel });
      console.log("set " + property + " to " + cond.max);
    } else if (value < cond.min) {
      const color = initial.set(channel, cond.min, true);
      phases.push({ color, channel });
      console.log("set " + property + " to " + cond.min);
    } else {
      console.log(property + " ok");
    }
  };

  let isOkay = false;
  let i = 0;

  while (!isOkay && i < maxAttempts) {
    const errors = group.colorFits(
      // @ts-ignore
      last(phases).color,
      false,
      fuzz
    );
    console.log(errors);
    if (errors.matches) {
      console.log("Color Okay!");
      isOkay = true;
    }

    /**
     * previously edited all values here, but what about one at a time?
     * separating into a function to make that switch easier
     */
    errors.errors.map((e) => applyRule(e.condition));
    // /group.definitions.conditions.forEach(applyRule);

    i++;
  }

  return (
    <div>
      {phases.map(({ color, channel }, i) => (
        <div key={i}>
          {channel !== null && (
            <Title importance="h4">Edited {channel?.title}</Title>
          )}
          <Swatch color={color} size={100} />
          <ColorInfo color={color} initialOpen={false} />
        </div>
      ))}
      <Title importance="h4">{isOkay ? "Passed" : "Still Failed"}</Title>
    </div>
  );
};
