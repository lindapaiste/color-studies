import { KeyedLCHWeights, LAB } from "./types";

/**
 * copied from https:// github.com/zschuessler/DeltaE/blob/master/src/dE94.js
 * but converted to typescript
 */

/**
 * @class dE94
 * @classdesc
 * The CIE94 algorithm: an iteration of the CIE76 algorithm.
 * http:// en.wikipedia.org/wiki/Color_difference#CIE94
 * @constructs dE94
 * @memberOf DeltaE
 * @property {object} x1 The LAB color configuration object.
 * @property {number} x1.L The lightness value, on scale of 0-100.
 * @property {number} x1.A The chroma value, on scale of -128 to 128.
 * @property {number} x1.B The hue value, on scale of -128 to 128.
 * @property {object} x2 The LAB color configuration object.
 * @property {number} x2.L The lightness value, on scale of 0-100.
 * @property {number} x2.A The chroma value, on scale of -128 to 128.
 * @property {number} x2.B The hue value, on scale of -128 to 128.
 * @property {object} weights The weights configuration object.
 * @property {number} weights.lightness A weight factor to apply to lightness.
 * @property {number} weights.chroma A weight factor to apply to chroma.
 * @property {number} weights.hue A weight factor to apply to hue.
 * @example
 * const deltaE = new dE94(
 *     {L:50, A:50, B:50},
 *     {L:100, A:50, B:50},
 * );
 * console.log(deltaE.getDeltaE());
 */
export default class DeltaE1994 {
  x1: LAB;

  x2: LAB;

  weights: Required<KeyedLCHWeights> & { K1: number; K2: number };

  constructor(x1: LAB, x2: LAB, weights: KeyedLCHWeights = {}) {
    this.x1 = x1;
    this.x2 = x2;

    const { lightness = 1, chroma = 1, hue = 1 } = weights;

    const k1k2 =
      lightness === 1
        ? {
            K1: 0.045,
            K2: 0.015,
          }
        : {
            K1: 0.048,
            K2: 0.014,
          };

    this.weights = {
      ...k1k2,
      lightness,
      chroma,
      hue,
    };
  }

  /**
   * Returns the dE94 value.
   * @method
   * @returns {number}
   */
  public getDeltaE(): number {
    const { x1, x2 } = this;

    return Math.sqrt(
      this.calculateL(x1, x2) ** 2 +
        this.calculateA(x1, x2) ** 2 +
        this.calculateB(x1, x2) ** 2
    );
  }

  /**
   * Calculates the lightness value.
   * @method
   * @returns {number}
   */
  private calculateL(x1: LAB, x2: LAB): number {
    return (x1.L - x2.L) / this.weights.lightness;
  }

  /**
   * Calculates the chroma value.
   * @method
   * @returns {number}
   */
  private calculateA(x1: LAB, x2: LAB): number {
    // top
    const c1 = Math.sqrt(x1.A ** 2 + x1.B ** 2);
    const c2 = Math.sqrt(x2.A ** 2 + x2.B ** 2);
    const cab = c1 - c2;

    // bottom
    const sc = 1 + this.weights.K1 * c1;

    return cab / (this.weights.chroma * sc);
  }

  /**
   * Calculates the hue value.
   * @method
   * @returns {number}
   */
  private calculateB(x1: LAB, x2: LAB): number {
    // cab
    const c1 = Math.sqrt(x1.A ** 2 + x1.B ** 2);
    const c2 = Math.sqrt(x2.A ** 2 + x2.B ** 2);
    const cab = c1 - c2;

    // top
    const a = x1.A - x2.A;
    const b = x1.B - x2.B;
    const hab = Math.sqrt(a ** 2 + b ** 2 - cab ** 2) || 0;

    // bottom
    const sh = 1 + this.weights.K2 * c1;

    return hab / sh;
  }
}
