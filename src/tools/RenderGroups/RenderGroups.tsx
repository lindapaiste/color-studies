import React from "react";
import { ColorSet, Title } from "components";
import { allGroupNames, getGroupHexes } from "data";

export const RenderGroups = () => (
  <div>
    {allGroupNames().map((group) => (
      <div key={group}>
        <Title>{group}</Title>
        <ColorSet colors={getGroupHexes(group)} wrap height={35} />
      </div>
    ))}
  </div>
);
