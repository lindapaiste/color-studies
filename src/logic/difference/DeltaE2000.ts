import { LAB, KeyedLCHWeights } from "./types";

/**
 * copied from https://github.com/zschuessler/DeltaE/blob/master/src/dE00.js
 * but converted to typescript
 */

/**
 * Gives the radian equivalent of a specified degree angle.
 * @method
 * @returns {number}
 */
function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Gives the degree equivalent of a specified radian.
 * @method
 * @returns {number}
 */
function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * @class DeltaE2000
 * @classdesc
 * The CIE2000 color difference algorithm.
 * http:// en.wikipedia.org/wiki/Color_difference#CIEDE2000
 * @constructs dE00
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
 * const deltaE = new dE00(
 *     {L:50, A:50, B:50},
 *     {L:100, A:50, B:50},
 * );
 * console.log(deltaE.getDeltaE());
 */
export default class DeltaE2000 {
  x1: LAB;

  x2: LAB;

  weights: KeyedLCHWeights;

  ksubL: number;

  ksubC: number;

  ksubH: number;

  deltaLPrime: number;

  LBar: number;

  C1: number;

  C2: number;

  CBar: number;

  aPrime1: number;

  aPrime2: number;

  CPrime1: number;

  CPrime2: number;

  CBarPrime: number;

  deltaCPrime: number;

  SsubL: number;

  SsubC: number;

  hPrime1: number;

  hPrime2: number;

  deltahPrime: number;

  deltaHPrime: number;

  HBarPrime: number;

  T: number;

  SsubH: number;

  RsubT: number;

  constructor(x1: LAB, x2: LAB, weights?: KeyedLCHWeights) {
    this.x1 = x1;
    this.x2 = x2;

    this.weights = weights || {};
    this.ksubL = this.weights.lightness || 1;
    this.ksubC = this.weights.chroma || 1;
    this.ksubH = this.weights.hue || 1;

    // Delta L Prime
    this.deltaLPrime = x2.L - x1.L;

    // L Bar
    this.LBar = (x1.L + x2.L) / 2;

    // C1 & C2
    this.C1 = Math.sqrt(x1.A ** 2 + x1.B ** 2);
    this.C2 = Math.sqrt(x2.A ** 2 + x2.B ** 2);

    // C Bar
    this.CBar = (this.C1 + this.C2) / 2;

    // A Prime 1
    this.aPrime1 =
      x1.A +
      (x1.A / 2) * (1 - Math.sqrt(this.CBar ** 7 / (this.CBar ** 7 + 25 ** 7)));

    // A Prime 2
    this.aPrime2 =
      x2.A +
      (x2.A / 2) * (1 - Math.sqrt(this.CBar ** 7 / (this.CBar ** 7 + 25 ** 7)));

    // C Prime 1
    this.CPrime1 = Math.sqrt(this.aPrime1 ** 2 + x1.B ** 2);

    // C Prime 2
    this.CPrime2 = Math.sqrt(this.aPrime2 ** 2 + x2.B ** 2);

    // C Bar Prime
    this.CBarPrime = (this.CPrime1 + this.CPrime2) / 2;

    // Delta C Prime
    this.deltaCPrime = this.CPrime2 - this.CPrime1;

    // S sub L
    this.SsubL =
      1 +
      (0.015 * (this.LBar - 50) ** 2) / Math.sqrt(20 + (this.LBar - 50) ** 2);

    // S sub C
    this.SsubC = 1 + 0.045 * this.CBarPrime;

    /**
     * Properties set in getDeltaE method, for access to convenience functions
     */
    // h Prime 1
    this.hPrime1 = 0;

    // h Prime 2
    this.hPrime2 = 0;

    // Delta h Prime
    this.deltahPrime = 0;

    // Delta H Prime
    this.deltaHPrime = 0;

    // H Bar Prime
    this.HBarPrime = 0;

    // T
    this.T = 0;

    // S sub H
    this.SsubH = 0;

    // R sub T
    this.RsubT = 0;
  }

  /**
   * Returns the deltaE value.
   * @method
   * @returns {number}
   */
  getDeltaE(): number {
    // h Prime 1
    this.hPrime1 = this.gethPrime1();

    // h Prime 2
    this.hPrime2 = this.gethPrime2();

    // Delta h Prime
    this.deltahPrime = this.getDeltahPrime();

    // Delta H Prime
    this.deltaHPrime =
      2 *
      Math.sqrt(this.CPrime1 * this.CPrime2) *
      Math.sin(degreesToRadians(this.deltahPrime) / 2);

    // H Bar Prime
    this.HBarPrime = this.getHBarPrime();

    // T
    this.T = this.getT();

    // S sub H
    this.SsubH = 1 + 0.015 * this.CBarPrime * this.T;

    // R sub T
    this.RsubT = this.getRsubT();

    // Put it all together!
    const lightness = this.deltaLPrime / (this.ksubL * this.SsubL);
    const chroma = this.deltaCPrime / (this.ksubC * this.SsubC);
    const hue = this.deltaHPrime / (this.ksubH * this.SsubH);

    return Math.sqrt(
      lightness ** 2 + chroma ** 2 + hue ** 2 + this.RsubT * chroma * hue
    );
  }

  /**
   * Returns the RT variable calculation.
   * @method
   * @returns {number}
   */
  getRsubT(): number {
    return (
      -2 *
      Math.sqrt(this.CBarPrime ** 7 / (this.CBarPrime ** 7 + 25 ** 7)) *
      Math.sin(
        degreesToRadians(60 * Math.exp(-1 * ((this.HBarPrime - 275) / 25) ** 2))
      )
    );
  }

  /**
   * Returns the T variable calculation.
   * @method
   * @returns {number}
   */
  getT(): number {
    return (
      1 -
      0.17 * Math.cos(degreesToRadians(this.HBarPrime - 30)) +
      0.24 * Math.cos(degreesToRadians(2 * this.HBarPrime)) +
      0.32 * Math.cos(degreesToRadians(3 * this.HBarPrime + 6)) -
      0.2 * Math.cos(degreesToRadians(4 * this.HBarPrime - 63))
    );
  }

  /**
   * Returns the H Bar Prime variable calculation.
   * @method
   * @returns {number}
   */
  getHBarPrime(): number {
    if (Math.abs(this.hPrime1 - this.hPrime2) > 180) {
      return (this.hPrime1 + this.hPrime2 + 360) / 2;
    }

    return (this.hPrime1 + this.hPrime2) / 2;
  }

  /**
   * Returns the Delta h Prime variable calculation.
   * @method
   * @returns {number}
   */
  getDeltahPrime(): number {
    // When either C′1 or C′2 is zero, then Δh′ is irrelevant and may be set to
    // zero.
    if (this.C1 === 0 || this.C2 === 0) {
      return 0;
    }

    if (Math.abs(this.hPrime1 - this.hPrime2) <= 180) {
      return this.hPrime2 - this.hPrime1;
    }

    if (this.hPrime2 <= this.hPrime1) {
      return this.hPrime2 - this.hPrime1 + 360;
    }

    return this.hPrime2 - this.hPrime1 - 360;
  }

  /**
   * Returns the h Prime 1 variable calculation.
   * @method
   * @returns {number}
   */
  gethPrime1(): number {
    return this.gethPrimeFn(this.x1.B, this.aPrime1);
  }

  /**
   * Returns the h Prime 2 variable calculation.
   * @method
   * @returns {number}
   */
  gethPrime2(): number {
    return this.gethPrimeFn(this.x2.B, this.aPrime2);
  }

  /**
   * A helper function to calculate the h Prime 1 and h Prime 2 values.
   * @method
   * @private
   * @returns {number}
   */
  private gethPrimeFn = (x: number, y: number): number => {
    if (x === 0 && y === 0) {
      return 0;
    }

    const hueAngle = radiansToDegrees(Math.atan2(x, y));

    return hueAngle >= 0 ? hueAngle : hueAngle + 360;
  };
}
