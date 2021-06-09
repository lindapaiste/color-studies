import React, { ReactNode } from "react";
import { Tooltip } from "components";
import { BoxData, Evaluation } from "logic/boxSets/types";
import "./box-style.css";
import { round } from "lib";
import { CanGetHex } from "logic/color/types";

export const Box = ({
  color,
  children,
}: {
  color: CanGetHex;
  children?: ReactNode;
}) => (
  <div className="boxes-box" style={{ borderColor: color.hex() }}>
    {children}
  </div>
);

/**
 * default ball tooltip render function, which can be overwritten
 * exported in case a custom renderer wants to include it
 */
export const TooltipContent = ({
  distances,
  distance,
  distinctness,
}: Evaluation<unknown>) => (
  <div>
    <div>distance: {round(distance, 2)}</div>
    <div>distinctness: {round(distinctness, 2)}</div>
    <div>distances: {distances.map((d) => round(d, 2)).join(", ")}</div>
  </div>
);

/**
 * if tooltip content is a separate component, need to deal with forwardRef issues
 * for some reason, making Ball a React.forwardRef doesn't work.
 * so ball will stay a pure div inside of a tooltip passer
 */
type BallProps = Evaluation<CanGetHex> & {
  RenderTooltip?(props: Evaluation<CanGetHex>): NonNullable<ReactNode>;
};
export const Ball = ({
  RenderTooltip = TooltipContent,
  ...props
}: BallProps) => (
  <Tooltip title={RenderTooltip(props)}>
    <div
      className="boxes-ball"
      style={{ backgroundColor: props.color.hex() }}
    />
  </Tooltip>
);

export const RenderBoxData = ({ data }: { data: BoxData<CanGetHex>[] }) => (
  <div className="boxes-area">
    {data.map((box, i) => (
      <Box key={i} color={box.color}>
        {box.matches.map((match, j) => (
          <Ball key={j} {...match} />
        ))}
      </Box>
    ))}
  </div>
);
