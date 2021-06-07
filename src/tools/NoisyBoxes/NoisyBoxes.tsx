import React, { useEffect, useMemo, useState } from "react";
import { createColors } from "logic/gradient/channelShiftSet";
import { BoxData, Evaluation, Levers } from "logic/boxSets/types";
import { getError, matchToChoices } from "logic/boxSets/colorMatchesBox";
import { shuffleData } from "logic/boxSets/shuffleData";
import { flatMap, makeArray } from "lib";
import { withModelNoise } from "logic/noise/modelNoise";
import { Toggle } from "components";
import { usePartialState } from "lib/util-hooks";
import { IColorAdapter } from "logic/color/types";
import { deltaE76 } from "logic/difference/distance";
import { RenderBoxData } from "./RenderBoxData";
import { LeverControls } from "./LeverControls";
import { ChannelShiftControls, useControls } from "./ChannelShiftControls";
import "./box-style.css";

/**
 * right now just looks at a bunch of random colors and filters
 * rather than computing a noisy color that is expected to match
 */

export interface Props {
  colors: IColorAdapter[];
  levers: Levers;
  isShuffle: boolean;
}

export const NoisyBoxes = ({ colors, levers, isShuffle }: Props) => {
  /**
   * use Memos to reduce re-rendering because want to
   * be able to tweak levers with the same color choices
   * the evaluation itself does not need the levers,
   * they are used when seeing if the evaluation is a match
   */
  const evaluations: Evaluation[] = useMemo(() => {
    // const random = randomColors(200);
    const random = flatMap(colors, (c) =>
      makeArray(100, () =>
        withModelNoise({
          color: c,
          colorSpace: "rgb",
          noiseRatio: 0.3,
        })
      )
    );
    return random.map((c) => matchToChoices(deltaE76, c, colors));
  }, [colors]);

  const boxData: BoxData[] = colors.map((color) => ({
    color,
    matches: [],
    rejected: [],
  }));

  evaluations.forEach((evaluation) => {
    const isError = getError(evaluation, levers);
    if (isError) return;
    const i = colors.indexOf(evaluation.match);
    if (i === -1) {
      console.error("cannot find index for color object");
      return;
    }
    boxData[i].matches.push(evaluation);
  });

  useEffect(() => {
    console.log("distance between boxes");
    colors.map((c) => colors.map((t) => console.log(deltaE76(c, t))));
  }, [colors]);

  const final = isShuffle ? shuffleData(boxData) : boxData;

  return <RenderBoxData data={final} />;
};

export const DEFAULT_LEVERS: Levers = {
  minDistance: 0,
  maxDistance: 20,
  minDistinctness: 10,
  maxDistinctness: 50,
};

export const NoisyBoxTool = () => {
  const [controls, setControls] = useControls();
  const [levers, updateLevers] = usePartialState(DEFAULT_LEVERS);
  const [isShuffle, setIsShuffle] = useState(false);

  const colors = useMemo(() => {
    try {
      return createColors(controls);
    } catch (e) {
      return [];
    }
  }, [controls]);

  return (
    <div className="boxes-tool-screen">
      <div>
        <ChannelShiftControls state={controls} update={setControls} />
        <LeverControls state={levers} update={updateLevers} />
        <Toggle value={isShuffle} onChange={setIsShuffle} label="Shuffled" />
      </div>
      <NoisyBoxes colors={colors} levers={levers} isShuffle={isShuffle} />
    </div>
  );
};
