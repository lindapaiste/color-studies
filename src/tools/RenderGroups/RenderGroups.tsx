import { GROUPINGS } from "../../grouping/group-data";
import React from "react";
import { RenderSet } from "../../sharedComponents/color/RenderSet";
import { Title } from "../../sharedComponents/ui/Title";

export const RenderGroups = () => {
  return (
    <div>
      {GROUPINGS.map(grouping => (
        <div key={grouping.name}>
          <Title>{grouping.name}</Title>
          <RenderSet colors={grouping.hexes} wrap={true} height={35} />
        </div>
      ))}
    </div>
  );
};
