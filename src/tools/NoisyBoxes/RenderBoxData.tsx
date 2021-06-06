import React, { ReactNode } from "react";
import { BoxData, Evaluation } from "../../boxSets/types";
import "./box-style.css";
import { Tooltip } from "../../sharedComponents/ui/Tooltip";
import { round } from "../../lib";
import { I_GetHex } from "../../color/types";

export const RenderBoxData = ({ data }: { data: BoxData<I_GetHex>[] }) => {
  return (
    <div className={"boxes-area"}>
      {data.map((box, i) => (
        <Box key={i} color={box.color}>
          {box.matches.map((match, j) => (
            <Ball key={j} {...match} />
          ))}
        </Box>
      ))}
    </div>
  );
};

export const Box = ({
  color,
  children,
}: {
  color: I_GetHex;
  children?: ReactNode;
}) => (
  <div className={"boxes-box"} style={{ borderColor: color.hex() }}>
    {children}
  </div>
);

/**
 * default ball tooltip render function, which can be overwritten
 * exported in case a custom renderer wants to include it
 */
export const TooltipContent = (props: Evaluation<any>) => (
  <div>
    <div>distance: {round(props.distance, 2)}</div>
    <div>distinctness: {round(props.distinctness, 2)}</div>
    <div>distances: {props.distances.map((d) => round(d, 2)).join(", ")}</div>
  </div>
);

/**
 * if tooltip content is a separate component, need to deal with forwardRef issues
 * for some reason, making Ball a React.forwardRef doesn't work.
 * so ball will stay a pure div inside of a tooltip passer
 */
type BallProps = Evaluation<I_GetHex> & {
  RenderTooltip?(props: Evaluation<I_GetHex>): NonNullable<ReactNode>;
};
export const Ball = ({
  RenderTooltip = TooltipContent,
  ...props
}: BallProps) => {
  return (
    <Tooltip title={RenderTooltip(props)}>
      <div
        className="boxes-ball"
        style={{ backgroundColor: props.color.hex() }}
      />
    </Tooltip>
  );
};
