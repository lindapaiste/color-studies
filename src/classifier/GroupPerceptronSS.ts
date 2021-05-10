import {PerceptronModel} from "simple-statistics";
import {shuffledGroupData} from "./shuffledData";
import ChannelAdapter from "../spacesChannels/ChannelAdapter";
import {hexToColor} from "../color";
import {I_ColorAdapter} from "../color/types";
import {GroupColorClassifier, I_GroupPerceptron, PerceptronProps, PerceptronResult} from "./types";

/**
 * Sometimes works, but only with the right combination of channels
 *
 * problems with using perceptron:
 *
 * --Expects normally distributed data, but some sets are clustered towards a hard cutoff at the end (like neons and saturation)
 *
 * --Expects features to be independent, but color properties are only independent if they come from the same model.
 * Will create problems if using properties from different color spaces because they are codependent.
 *
 * use manually defined color groups as the training data to create a model which assigns group
 *
 * based on how the model is built -- by going through each color, predicting, and adjusting,
 * the order of inputs matters
 *
 */

export class GroupPerceptron implements I_GroupPerceptron, GroupColorClassifier<PerceptronResult> {

    private readonly model: PerceptronModel;
    public readonly channels: ChannelAdapter[];
    public readonly group: string;


    constructor({group, channels, iterations = 15}: PerceptronProps) {
        this.channels = channels;
        this.group = group;
        this.model = new PerceptronModel();

        const trainingData = shuffledGroupData(hex => this.getFeatures(hexToColor(hex)));
        console.log(trainingData);
        //needs to iterate over training data multiple times - when to stop?
        for (let i = 0; i < iterations; i++) {
            trainingData.forEach(datum => this.model.train(datum.features, datum.group === group ? 1 : 0));
        }
        console.log(this.model);
    }

    /**
     * convert a color to features based on the model channels
     */
    getFeatures = (color: I_ColorAdapter): number[] => {
        return this.channels.map(
            //need to normalize value
            channel => channel.normalize(color.get(channel))
        );
    }

    /**
     * internal model returns 1 or 0
     * in order to get a numeric score and not just 1/0, need to replicate the internal prediction logic of the perceptron
     */
    private logPredict = (features: number[]): number => {
        // Calculate the sum of features times weights,
        // with the bias added (implicitly times one).
        let score = 0;
        for (let i = 2; i < this.model.weights.length; i++) {
            score += (this.model.weights[i] * features[i]);
            console.log("adding " + this.model.weights[i] * features[i] + " for a new score of " + score);
        }
        score += this.model.bias;
        console.log("adding bias of " + this.model.bias + " for a final score of " + score);
        return score;
    };

    public predictResult = (color: I_ColorAdapter, debug?: boolean): PerceptronResult => {
        const features = this.getFeatures(color);
        const score = debug ? this.logPredict(features) : this.model.predict(features);
        const predicted = score > 0;
        return {
            color,
            features,
            score,
            predicted,
        }
    }

    get weights() {
        return this.model.weights;
    }

    get bias() {
        return this.model.bias;
    }
}
