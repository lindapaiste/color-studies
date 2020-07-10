import React, { useMemo, useState } from "react";
import { Scale } from "chroma-js";
import { useNumberInput } from "../sharedComponents/form/useNumberInput";
import { useGenericInput } from "../sharedComponents/form/useGenericInput";
import { channelShift } from "./channelShift";
import { CompareScaleModes } from "./CompareScaleModes";
import { TextInput } from "../sharedComponents/form/TextInput";
import { NumberInput } from "../sharedComponents/form/NumberInput";
/**
 * doesn't check if the channel is valid, just that it appears valid
 * because this is a text input, so there will be multiple partial entries before a complete one
 */
const isCompleteChannel = (string: string) =>
  string.match(/^\w{3,4}\.\w$/) !== null;

export const GradientCompareTool = () => {
  const [state, setState] = useControls();

  return (
    <div>
      <ChannelShiftControls initialValue={state} onChange={setState} />
      <RenderMultiModeScale {...state} />
    </div>
  );
};

export const RenderMultiModeScale = ({
  channel,
  shift,
  channelMax,
  colorCount
}: ChannelShiftSettings) => {
  const scale: Scale | null = useMemo(() => {
    if (!isCompleteChannel(channel)) {
      return null;
    }
    try {
      return channelShift(channel, shift, channelMax);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [channel, shift, channelMax]);

  return (
    <div>
      {scale !== null && colorCount > 0 && (
        <CompareScaleModes scale={scale} count={colorCount} />
      )}
    </div>
  );
};

export interface ChannelShiftSettings {
  channel: string;
  channelMax: number;
  shift: number;
  colorCount: number;
}

export const DEFAULT_SETTINGS: ChannelShiftSettings = {
  channel: "lab.l",
  channelMax: 100,
  shift: 50,
  colorCount: 4
};

export const useControls = (initialValue?: Partial<ChannelShiftSettings>) => {
  return useState<ChannelShiftSettings>({
    ...DEFAULT_SETTINGS,
    ...initialValue
  });
};

/**
 * separated the controls from the results so that other components can use the same set of controls
 */
export const ChannelShiftControls = ({
  initialValue = {},
  onChange
}: {
  initialValue?: Partial<ChannelShiftSettings>;
  onChange: (s: ChannelShiftSettings) => void;
}) => {
  const [state, _setState] = useControls(initialValue);

  const applySettings = (settings: Partial<ChannelShiftSettings>): void => {
    const combined = { ...state, settings };
    _setState(combined);
    onChange(combined);
  };

  return (
    <div>
      <div>
        <span>
          Channel:{" "}
          <TextInput
            value={state.channel}
            onChange={v => applySettings({ channel: v })}
          />
        </span>
        <span>
          Channel Max:{" "}
          <NumberInput
            value={state.channelMax}
            onChange={v => applySettings({ channelMax: v })}
          />
        </span>
        <span>
          Shift Amount:{" "}
          <NumberInput
            value={state.shift}
            onChange={v => applySettings({ shift: v })}
          />
        </span>
        <span>
          Color Count:{" "}
          <NumberInput
            value={state.colorCount}
            onChange={v => applySettings({ colorCount: v })}
          />
        </span>
      </div>
      {state.shift > state.max * 0.5 && (
        <div>
          WARNING: Shift amount should not be more than half of the channel
          range due to limitations of the current method. This will likely be
          fixed in the future.
        </div>
      )}
    </div>
  );
};
