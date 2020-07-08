import { GROUPINGS } from "./data";
import React from "react";
import { RenderSet } from "../RenderSet";

export const RenderGroups = () => {
  return (
    <div>
      {GROUPINGS.map(grouping => (
        <div key={grouping.name}>
          <h2>{grouping.name}</h2>
          <RenderSet colors={grouping.hexes} wrap={true} />
        </div>
      ))}
    </div>
  );
};
