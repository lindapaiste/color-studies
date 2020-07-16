/**
 * a confusion matrix contains the predictions of a true/false classifier
 * based on a set of data where the actual true/false outcome is known
 *
 * the only required data is a 2x2 matrix of [actual true, actual false] x [predicted true, predicted false]
 * this is the TestResults interface
 *
 * many probabilities and scores can be computed from the TestResults interface
 * these are grouped into interfaces:
 * Sums (simple addition of TestResults)
 * Conditionals (2x2x2 matrix of conditional probabilities of [actual, predicted] x [true, false]  x (conditional on opposite of [actual, predicted]) [true, false])
 * Scores (various numeric measurements which determine how good the classifier is)
 */

export interface TestResults {
    falsePositives: number;
    truePositives: number;
    falseNegatives: number;
    trueNegatives: number;
}

export interface Sums {
    actualPositive: number;
    actualNegative: number;
    predictedPositive: number;
    predictedNegative: number;
    total: number;
}

export interface Conditionals {
    truePositiveRate: number;
    falsePositiveRate: number;
    trueNegativeRate: number;
    falseNegativeRate: number;
    positivePredictiveValue: number;
    negativePredictiveValue: number;
    falseDiscoveryRate: number;
    falseOmissionRate: number;
}

export const conditionalsKeys: Array<keyof Conditionals> = ['truePositiveRate', 'falsePositiveRate', 'trueNegativeRate', 'falseNegativeRate', 'positivePredictiveValue', 'negativePredictiveValue', 'falseDiscoveryRate', 'falseOmissionRate'];

export interface Scores {
    accuracy: number;
    balancedAccuracy: number;
    prevalenceThreshold: number;
    threatScore: number;
    f1Score: number;
    matthewsCorrelationCoefficient: number;
    fowlkesMallowsIndex: number;
    informedness: number;
    markedness: number;
}

export const scoresKeys: Array<keyof Scores> = ['accuracy', 'balancedAccuracy', 'prevalenceThreshold', 'threatScore', 'f1Score', 'matthewsCorrelationCoefficient', 'fowlkesMallowsIndex', 'informedness', 'markedness',];

export interface I_ConfusionMatrix extends TestResults, Sums, Conditionals, Scores {}

export class ConfusionMatrix implements I_ConfusionMatrix {
    /**
     * can edit the raw numbers
     * all computations can only be read
     */
    public falsePositives: number;
    public truePositives: number;
    public falseNegatives: number;
    public trueNegatives: number;

    /**
     * can construct from a set of results,
     * or can start with zeros and build the results by incrementing the values within this class
     */
    constructor(results?: TestResults) {
        this.falsePositives = results ? results.falsePositives : 0;
        this.truePositives = results ? results.truePositives : 0;
        this.falseNegatives = results ? results.falseNegatives : 0;
        this.trueNegatives = results ? results.trueNegatives : 0;
    }

    /**
     * sum of all entries - for use in divisor
     */
    get total(): number {
        return this.falseNegatives + this.falsePositives + this.trueNegatives + this.truePositives;
    }

    /**
     * the number of positives in the data set
     */
    get actualPositive(): number {
        return this.truePositives + this.falseNegatives;
    }

    /**
     * the number of negatives in the data set
     */
    get actualNegative(): number {
        return this.trueNegatives + this.falsePositives;
    }

    /**
     * the number of positive predictions
     */
    get predictedPositive(): number {
        return this.truePositives + this.falsePositives;
    }

    /**
     * the number of negative predictions
     */
    get predictedNegative(): number {
        return this.trueNegatives + this.falseNegatives;
    }

    /**
     * rate of accurate assignment
     */
    get accuracy(): number {
        return (this.trueNegatives + this.truePositives) / this.total;
    }

    /**
     * aka sensitivity, recall, hit rate
     * conditional probability of positive prediction given positive data
     */
    get truePositiveRate(): number {
        return this.truePositives / this.actualPositive;
    }

    /**
     * aka specificity or selectivity
     * conditional probability of negative prediction given negative data
     */
    get trueNegativeRate(): number {
        return this.trueNegatives / this.actualNegative;
    }

    /**
     * aka precision
     * conditional probability that a result is truly positive given a positive prediction
     */
    get positivePredictiveValue(): number {
        return this.truePositives / this.predictedPositive;
    }

    /**
     * conditional probability of false data given false prediction
     */
    get negativePredictiveValue(): number {
        return this.trueNegatives / this.predictedNegative;
    }

    /**
     * aka miss rate
     * conditional probability of negative prediction given positive data
     */
    get falseNegativeRate(): number {
        return 1 - this.truePositiveRate;
    }

    /**
     * aka fall-out
     * conditional probability of positive prediction given negative data
     */
    get falsePositiveRate(): number {
        return 1 - this.trueNegativeRate;
    }

    /**
     * conditional probability of negative data given positive prediction
     */
    get falseDiscoveryRate(): number {
        return 1 - this.positivePredictiveValue;
    }

    /**
     * conditional probability of positive data given negative prediction
     */
    get falseOmissionRate(): number {
        return 1 - this.negativePredictiveValue;
    }

    /**
     * The relationship between a screening tests' positive predictive value, ρ, and its target prevalence, ϕ, is proportional - though not linear in all but a special case. In consequence, there is a point of local extrema and maximum curvature defined only as a function of the sensitivity a and specificity b beyond which the rate of change of a test's ρ drops at a differential pace relative to ϕ. Herein, we show the mathematical model exploring this phenomenon and define the prevalence threshold ϕe point where this change occurs as: ϕe=a(−b+1)√+b−1(ε−1), where ε = a+b.
     */
    get prevalenceThreshold(): number {
        return (
            (Math.sqrt((this.truePositiveRate * (-this.trueNegativeRate + 1))) + this.trueNegativeRate - 1)
            /
            (this.truePositiveRate + this.trueNegativeRate - 1)
        );
    }

    /**
     * aka critical success index
     */
    get threatScore(): number {
        return this.truePositives / (this.truePositives + this.falseNegatives + this.falsePositives)
    }

    /**
     * average of truePositiveRate and trueNegativeRate
     * regular accuracy can be misleading when positives are rare because a high accuracy can result from properly assigning true negatives only
     */
    get balancedAccuracy(): number {
        return (this.truePositiveRate + this.trueNegativeRate) / 2;
    }

    /**
     * is the harmonic mean of precision (positivePredictiveValue) and sensitivity (truePositiveRate)
     */
    get f1Score(): number {
        return (this.positivePredictiveValue * this.truePositiveRate) /
            (this.positivePredictiveValue + this.truePositiveRate);
    }

    /**
     * aka phi coefficient
     * Takes into account true and false positives and negatives and is generally regarded as a balanced measure which can be used even if the classes are of very different sizes.
     * Returns a value between −1 and +1 where +1 is perfect prediction, 0 is no better than random prediction and −1 means completely wrong
     */
    get matthewsCorrelationCoefficient(): number {
        return (
            ((this.truePositives * this.trueNegatives) - (this.falsePositives * this.falseNegatives))
            /
            Math.sqrt(this.predictedPositive * this.predictedNegative * this.actualPositive * this.actualNegative)
        )
    }

    /**
     * measures the similarity between two clusterings
     */
    get fowlkesMallowsIndex(): number {
        return Math.sqrt(this.positivePredictiveValue * this.truePositiveRate);
    }

    get informedness(): number {
        return this.truePositiveRate + this.trueNegativeRate - 1;
    }

    /**
     * aka deltaP
     */
    get markedness(): number {
        return this.positivePredictiveValue + this.negativePredictiveValue - 1;
    }
}
