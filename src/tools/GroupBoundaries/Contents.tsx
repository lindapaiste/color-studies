import React, { useMemo } from "react";
import { sortBy } from "lib";
import { Title } from "components";
import { shuffledHexes } from "logic/classification/training/shuffledData";
import { allChannels } from "logic/colorspaces/channels";
import { ChannelBoundaryModel } from "logic/classification/model/boundary/ChannelBoundaryModel";
import { GroupModelTest } from "logic/classification/accuracy/GroupModelTest";
import { RenderModel } from "./RenderModel";
import { Settings } from "./Controls";
import { hexToColor } from "../../logic";

/**
 * Tool contents must build the models and execute the tests.
 */
export const Contents = ({ sampleSize, group: testGroup }: Settings) => {
  const data = useMemo(
    () =>
      shuffledHexes().map(({ hex, group }) => ({
        hex,
        group,
        color: hexToColor(hex),
      })),
    []
  );

  const models = useMemo(() => {
    const pairs = allChannels().map((channel) => {
      const model = new ChannelBoundaryModel(testGroup, data, channel);
      const tester = new GroupModelTest(model);
      tester.test(sampleSize);
      const { accuracy } = tester;
      return {
        channel,
        model,
        accuracy,
      };
    });
    return sortBy(
      pairs,
      (o) =>
        1 -
        Math.max(
          o.accuracy.positivePredictiveValue,
          o.accuracy.negativePredictiveValue
        )
    ); // do 1 minus to sort descending
  }, [testGroup, data, sampleSize]);

  return (
    <div>
      <Title>Boundaries for {testGroup}</Title>
      {models.map((model) => (
        <RenderModel {...model} key={model.channel.key} />
      ))}
    </div>
  );
};
