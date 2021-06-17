import React from "react";
import { ColorSet, Title } from "components";
import { allGroups } from "data";

/**
 * Displays the training data set
 */
export default () => (
  <div>
    {allGroups().map(({ name, hexes }) => (
      <div key={name}>
        <Title>{name}</Title>
        <div>{hexes.length} Colors</div>
        <ColorSet colors={hexes} wrap height={35} />
      </div>
    ))}
  </div>
);
