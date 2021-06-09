import { uniq } from "lib";
import { oneHot, tensor1d, tidy } from "@tensorflow/tfjs";

/**
 * Categorical data, such as color group, needs to be one-hot encoded.
 *
 * A one-hot encoding maps a defined set of strings to a set of binary arrays
 * where all values are 0 except for 1 (the "one hot").
 *
 * The length of each array equals the number of possible values.
 *
 * Can use tf.oneHot for this, though it's also easy to create the arrays.
 */

export class OneHotEncoder {
  /**
   * Legend is a dictionary of the one-hot arrays
   * keyed by the category name.
   *
   * Could one-hot encode complex values if using a different structure.
   *
   * Could support numbers as labels if using a different structure,
   * won't work currently because Object.values returns a string.
   */
  public readonly legend: Record<string, number[]>;

  /**
   * Store the unique values in order to ensure accurate lookup by index.
   */
  public readonly uniqueValues: string[];

  /**
   * Accessor for the dimensionality of the encoding.
   */
  public readonly length: number;

  /**
   * Inputs is probably an array of strings, but could also be numbers
   * if they represent categorical data.
   */
  constructor(inputs: string[]) {
    this.legend = {};
    const uniqueValues = uniq(inputs);
    this.length = uniqueValues.length;
    this.uniqueValues = uniqueValues;
    const oneHotEncodedValuesArray = tidy(() => {
      // get back values from 0 to the length of the uniqueVals array
      const indexes = uniqueValues.map((_, i) => i);
      // oneHot encode the values in the 1d tensor
      const oneHotEncodedValues = oneHot(
        tensor1d(indexes, "int32"),
        uniqueValues.length
      );
      // convert them from tensors back out to an array
      return oneHotEncodedValues.arraySync() as number[][];
    });
    // populate the legend with the key/values
    // expect the encodings to have the same indexes as the values
    uniqueValues.forEach((value, i) => {
      this.legend[value] = oneHotEncodedValuesArray[i];
    });
  }

  /**
   * Takes the category label and returns the one-hot encoded array.
   */
  encode = (input: string): number[] => this.legend[input];

  /**
   * Takes the one-hot encoded array and returns the corresponding label.
   * Note: must either assert that a label always exists or throw an Error.
   */
  decode = (output: number[]): string => {
    // find the entry in the legend that matches the value
    const index = Object.values(this.legend).findIndex((encoding) =>
      output.every((num, i) => encoding[i] === num)
    );
    if (index === -1) {
      throw new Error("No entry found in legend matching input array.");
    }
    return Object.keys(this.legend)[index];
  };
}
