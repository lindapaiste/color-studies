import React, { useMemo, useState } from "react";
import { NeuralNetwork } from "logic/classification/model/neural/NeuralNetwork";
import { sampleHexes } from "logic/classification/training/shuffledData";
import { Button, PredictionsByGroup } from "components";
import { Settings } from "./settings";

/**
 * Training is an expensive operation, so run only in response to a button click
 * instead of on every change of a setting.
 */
export const Contents = ({ sampleSize, ...modelSettings }: Settings) => {
  /**
   * Need this state to show a spinner while training.
   */
  const [isTraining, setIsTraining] = useState(false);

  /**
   * Only store the nn after it has been trained.
   */
  const [nn, setNn] = useState<NeuralNetwork>();

  /**
   * Create groups of hexes for training and checking.
   */
  const [training, checking] = useMemo(() => {
    const hexes = sampleHexes(2 * sampleSize);
    return [hexes.slice(0, sampleSize), hexes.slice(sampleSize)];
  }, [sampleSize]);

  /**
   * Function to execute the training
   */
  const onClickTrain = async () => {
    setIsTraining(true);
    const model = new NeuralNetwork(modelSettings);
    await model.train(training);
    console.log(nn);
    setIsTraining(false);
    setNn(model);
  };

  /**
   * Make predictions for the checking set.
   */
  const results = useMemo(
    () =>
      nn && !isTraining
        ? checking.map((o) => ({ ...o, predictions: nn.predict(o.hex) }))
        : [],
    [checking, nn, isTraining]
  );

  return (
    <div>
      <Button variant="contained" onClick={onClickTrain} disabled={isTraining}>
        Train
      </Button>
      {isTraining && <div>Training Model...</div>}
      {results.length > 0 && <PredictionsByGroup results={results} />}
    </div>
  );
};
