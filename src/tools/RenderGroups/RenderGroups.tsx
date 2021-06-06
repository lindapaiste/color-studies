import React from "react";
import { RenderSet } from "../../sharedComponents/color/RenderSet";
import { Title } from "../../sharedComponents/ui/Title";
import { allGroups } from "../../grouping";

export const RenderGroups = () => (
  <div>
    {allGroups().map((grouping) => (
      <div key={grouping.name}>
        <Title>{grouping.name}</Title>
        <RenderSet colors={grouping.hexes} wrap height={35} />
      </div>
    ))}
  </div>
);
