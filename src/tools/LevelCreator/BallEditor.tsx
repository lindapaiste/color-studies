import React, { useCallback, useEffect, useMemo, useState } from "react";
import { replaceIndex } from "lib";
import {
  Button,
  EditIcon,
  IconTooltipButton,
  SelectColor,
  XCircleIcon,
} from "components";
import { ColorAdapter } from "logic";
import {
  BallCreateSettings,
  generateBall,
} from "logic/boxSets/generateBoxBalls";
import { getError, matchToChoices } from "logic/boxSets/colorMatchesBox";
import { BoxData, Rejection } from "logic/boxSets/types";
import { shuffleData } from "logic/boxSets/shuffleData";
import { Ball, Box, TooltipContent } from "../NoisyBoxes/RenderBoxData";
import { BallDisplaySettings, Identifier } from "./types";

export interface DataProps {
  data: BoxData[];

  setData(data: BoxData[]): void;

  settings: BallCreateSettings;
}

export type Props = DataProps & BallDisplaySettings;

/**
 * the distance property of evaluation stores the distance to the matched box, not to the intended match
 * need to know the index of intended match to show that
 */
export const RejectionTooltip = ({ distances, error, ...props }: Rejection) => (
  <div>
    <div>{error.message}</div>
    <div>
      matches box #
      {distances.findIndex((v) => v === Math.min(...distances)) + 1}
    </div>
    <TooltipContent {...props} distances={distances} />
  </div>
);

// TODO: this component is a mess
export const EditingBall = ({
  data,
  setData,
  settings,
  id,
}: DataProps & { id: Identifier }) => {
  const setBallColor = useCallback(
    (color: ColorAdapter) => {
      const box = data[id.boxIndex];
      const ball = box.matches[id.ballIndex];
      setData(
        replaceIndex(data, id.boxIndex, {
          ...box,
          matches: replaceIndex(box.matches, id.ballIndex, { ...ball, color }),
        })
      );
    },
    [setData, id, data]
  );

  // the ball color passed down from props based on id
  const receivedColor = data[id.boxIndex].matches[id.ballIndex].color;

  const [color, setColor] = useState(receivedColor);

  // change color when switching id
  useEffect(() => {
    setColor(receivedColor);
  }, [receivedColor]);

  const evaluation = matchToChoices(
    settings.getDistance,
    color,
    data.map((box) => box.color)
  );

  const error = getError(evaluation, settings, data[id.boxIndex].color);

  useEffect(() => {
    if (error === false) {
      setBallColor(color);
    }
  }, [color, error, setBallColor]);

  return (
    <div>
      <SelectColor value={color} onChange={setColor} />
      {error && <div>{error.message}</div>}
    </div>
  );
};

/**
 * only allow editing when not shuffled
 * otherwise, need to redo because would not know the actual position/id in the data object
 */
export const BallsEditor = ({
  data,
  setData,
  settings,
  darkBackground,
  shuffle,
  showTools,
  showRejected,
}: Props) => {
  const [editing, setEditing] = useState<Identifier | null>(null);

  // no reason to append at the end, why not just replace this one?
  const handleRemove = (id: Identifier) => {
    const box = data[id.boxIndex];
    const replacement = generateBall(
      box.color,
      settings,
      data.map((b) => b.color)
    );
    setData(
      replaceIndex(data, id.boxIndex, {
        ...box,
        matches: replaceIndex(box.matches, id.ballIndex, replacement),
      })
    );
  };

  const preparedData = useMemo(
    () => (shuffle ? shuffleData(data) : data),
    [data, shuffle]
  );

  return (
    <div>
      {editing !== null && (
        <>
          <Button onClick={() => setEditing(null)}>Close</Button>
          <EditingBall
            data={data}
            setData={setData}
            settings={settings}
            id={editing}
          />
        </>
      )}
      <div
        className="boxes-area"
        style={{ backgroundColor: darkBackground ? "black" : "white" }}
      >
        {preparedData.map((box, boxIndex) => (
          <Box key={box.color.hex()} color={box.color}>
            {box.matches.map((match, ballIndex) => (
              // Note: disabled because balls are not guaranteed to be unique
              // eslint-disable-next-line react/no-array-index-key
              <div key={ballIndex}>
                <Ball {...match} />
                {showTools && !shuffle && (
                  <div>
                    <IconTooltipButton
                      title="Edit Color"
                      icon={
                        <EditIcon
                          htmlColor={darkBackground ? "white" : "black"}
                          fontSize="small"
                        />
                      }
                      onClick={() => setEditing({ boxIndex, ballIndex })}
                      style={{
                        padding: 2,
                      }}
                    />
                    <IconTooltipButton
                      title="Remove"
                      icon={
                        <XCircleIcon
                          htmlColor={darkBackground ? "white" : "black"}
                          fontSize="small"
                        />
                      }
                      onClick={() => handleRemove({ boxIndex, ballIndex })}
                      style={{
                        padding: 2,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
            {showRejected &&
              (box.rejected || []).map((match, i) => (
                <Ball
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  {...match}
                  RenderTooltip={() => RejectionTooltip(match)}
                />
              ))}
          </Box>
        ))}
      </div>
    </div>
  );
};
