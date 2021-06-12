import React from "react";
import { Slider, TextField } from "@material-ui/core";
import { Size } from "lib";
import { ChannelArg, toChannelObject } from "logic/spacesChannels/channels";
import { IColorAdapter } from "logic/color/types";
import { GenericProps, WithoutE } from "../atoms/types";
import { GradientBar } from "../atoms";

/**
 * expects a normalized value between 0 and 1
 */
export interface ExtraProps {
  startColor: IColorAdapter;
  channel: ChannelArg;
  normalized: boolean;
}

type Props<T> = WithoutE<GenericProps<T>> &
  ExtraProps &
  Partial<Size> & { value: T };

/**
 * Just the slider itself, without labels or borders
 * In order to be compatible with the Material UI input label system,
 * needs to take props value and onChange(e).
 */
export const ChannelSlider = <T extends number | number[]>({
  startColor,
  channel,
  normalized,
  onChange,
  width = 200,
  height = 50,
  ...props
}: Props<T>) => {
  const channelObj = toChannelObject(channel);
  return (
    <div style={{ position: "relative" }}>
      <GradientBar
        width={width}
        height={height}
        initial={startColor}
        channel={channelObj}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Slider
          {...props}
          min={normalized ? 0 : channelObj.min}
          max={normalized ? 1 : channelObj.max}
          // step MUST be defined in order to use normalized values because the default step is 1
          step={0.001}
          onChange={(_, v) => onChange(v as T)}
        />
      </div>
    </div>
  );
};

/**
 * Trying to get the Material UI outline input style around an arbitrary
 * component is an absolute NIGHTMARE. Settling for CSS trickery where there
 * is a hidden input in the background and the Slider on top.
 * Is a teensy bit below center, but close enough!
 */
export const ChannelSliderInput = <T extends number | number[]>({
  label = "Channel Range",
  padding = 10,
  width = 200,
  height = 50,
  ...props
}: Props<T> & { padding?: number }) => {
  const size = { width: width + 2 * padding, height: height + 2 * padding };
  return (
    <div style={{ position: "relative", ...size }}>
      <TextField
        variant="outlined"
        label={label}
        value={props.value.toString()}
        InputLabelProps={{ shrink: true }}
        InputProps={{ hidden: true, disabled: true }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        inputProps={{ "aria-hidden": true, tabIndex: -1 }}
        style={{ position: "absolute", ...size }}
      />
      <div style={{ position: "absolute", padding }}>
        <ChannelSlider width={width} height={height} {...props} />
      </div>
    </div>
  );
};
