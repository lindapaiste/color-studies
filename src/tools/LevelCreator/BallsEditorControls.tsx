import React from "react";
import { StateUpdateProps } from "lib/util-hooks";
import { Toggle } from "components";
import { BallDisplaySettings } from "./types";

/**
 * TODO: debug why the toggles are appearing off when the initial state is true
 */
export const BallEditorControls = ({
  state,
  update,
}: StateUpdateProps<BallDisplaySettings>) => (
  <div
    style={{
      display: "flex",
    }}
  >
    <Toggle
      label="Shuffle"
      value={state.shuffle}
      onChange={(v) => update({ shuffle: v })}
    />
    <Toggle
      label="Show Tools"
      value={state.showTools}
      onChange={(v) => update({ showTools: v })}
    />
    <Toggle
      label="Black Background"
      value={state.darkBackground}
      onChange={(v) => update({ darkBackground: v })}
    />
    <Toggle
      label="Show Rejected"
      value={state.showRejected}
      onChange={(v) => update({ showRejected: v })}
    />
  </div>
);
