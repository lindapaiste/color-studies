import React, { useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import { Tool } from "components";
import { randomGroupName } from "data";
import { Size } from "lib";
import { PerceptronControls } from "../Perceptron/PerceptronControls";
import { allChannels } from "../../logic/spacesChannels/channels";

const Contents = ({ width, height }: Size) => {
  // get the ref for a DOM element to pass to tfvis
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const execute = async () => {
      const model = tf.sequential({
        layers: [
          tf.layers.dense({
            inputShape: [784],
            units: 32,
            activation: "relu",
          }),
          tf.layers.dense({ units: 10, activation: "softmax" }),
        ],
      });

      model.compile({
        optimizer: "sgd",
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
      });

      const data = tf.randomNormal([100, 784]);
      const labels = tf.randomUniform([100, 10]);

      const surface = { name: "show.fitCallbacks", tab: "Training" };
      // Train for 5 epochs with batch size of 32.
      await model.fit(data, labels, {
        epochs: 5,
        batchSize: 32,
        callbacks: tfvis.show.fitCallbacks(surface, ["loss", "acc"]),
      });
    };

    execute().then(() => console.log("done"));
  }, []);

  return <div ref={containerRef} />;
};

export const NeuralNetworkTool = () => (
  <Tool
    initialSettings={{
      testCount: 400,
      channels: allChannels(),
      group: randomGroupName(),
    }}
    RenderControls={PerceptronControls}
    RenderContents={Contents}
  />
);
