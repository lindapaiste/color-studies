import React from "react";
import { Slider } from "@material-ui/core";
import { Size } from "lib";
import { ChannelArg, toChannelObject } from "logic/spacesChannels/channels";
import { IColorAdapter } from "logic/color/types";
import { GenericProps, WithoutE } from "../atoms/types";
import { GradientBar } from "../atoms";
import { FormLabelWrapper } from "../atoms/LabelWrapper";

/**
 * expects a normalized value between 0 and 1
 */
// number | [number, number];
export interface ExtraProps {
  color: IColorAdapter;
  channel: ChannelArg;
  normalized: boolean;
}

type Props<T> = WithoutE<GenericProps<T>> & ExtraProps & Partial<Size>;

/**
 * just the slider itself, without labels or borders
 */
export const ChannelSlider = <T extends number | number[]>({
  color,
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
        initial={color}
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
 * version with label and border for consistency with other input elements
 */
export const ChannelSliderInput = <T extends number | number[]>({
  label = "Channel Range",
  ...props
}: Props<T>) => (
  <FormLabelWrapper label={label} padding={8}>
    <ChannelSlider {...props} />
  </FormLabelWrapper>
);
