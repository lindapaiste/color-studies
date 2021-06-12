/**
 * Edited to remove reliance on DbsValidation,
 * removed accessing functions and hex converting since just need the RYB conversion
 * added type annotations
 */

/** ************************************************************************************************
 *  Color Space - A RGB to RYB converter.
 *
 *  Copyright (C) 2013 Joshua Gentry
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http:// www.gnu.org/licenses/>.
 */

/** ********************************************************************************************
 * Given a RGB color, calculate the RYB color.  This code was taken from:
 *
 * http:// www.insanit.net/tag/rgb-to-ryb/
 *
 * Author: Arah J. Leonard
 * Copyright 01AUG09
 * Distributed under the LGPL - http:// www.gnu.org/copyleft/lesser.html
 * ALSO distributed under the The MIT License from the Open Source Initiative (OSI) -
 * http:// www.opensource.org/licenses/mit-license.php
 * You may use EITHER of these licenses to work with / distribute this source code.
 * Enjoy!
 */
export const rgbToRyb = (
  rgb: [number, number, number]
): [number, number, number] => {
  let [iRed, iGreen, iBlue] = rgb;

  // Remove the white from the color
  const iWhite = Math.min(iRed, iGreen, iBlue);

  iRed -= iWhite;
  iGreen -= iWhite;
  iBlue -= iWhite;

  const iMaxGreen = Math.max(iRed, iGreen, iBlue);

  // Get the yellow out of the red+green

  let iYellow = Math.min(iRed, iGreen);

  iRed -= iYellow;
  iGreen -= iYellow;

  // If this unfortunate conversion combines blue and green, then cut each in half to
  // preserve the value's maximum range.
  if (iBlue > 0 && iGreen > 0) {
    iBlue /= 2;
    iGreen /= 2;
  }

  // Redistribute the remaining green.
  iYellow += iGreen;
  iBlue += iGreen;

  // Normalize to values.
  const iMaxYellow = Math.max(iRed, iYellow, iBlue);

  if (iMaxYellow > 0) {
    const iN = iMaxGreen / iMaxYellow;

    iRed *= iN;
    iYellow *= iN;
    iBlue *= iN;
  }

  // Add the white back in.
  iRed += iWhite;
  iYellow += iWhite;
  iBlue += iWhite;

  // return [Math.floor(iRed), Math.floor(iYellow), Math.floor(iBlue)];
  return [iRed, iYellow, iBlue];
};

/** ********************************************************************************************
 * Given a RYB color, calculate the RGB color.  This code was taken from:
 *
 * http:// www.insanit.net/tag/rgb-to-ryb/
 *
 * Author: Arah J. Leonard
 * Copyright 01AUG09
 * Distributed under the LGPL - http:// www.gnu.org/copyleft/lesser.html
 * ALSO distributed under the The MIT License from the Open Source Initiative (OSI) -
 * http:// www.opensource.org/licenses/mit-license.php
 * You may use EITHER of these licenses to work with / distribute this source code.
 * Enjoy!
 */
export const rybToRgb = (
  ryb: [number, number, number]
): [number, number, number] => {
  let [iRed, iYellow, iBlue] = ryb;

  // Remove the whiteness from the color.
  const iWhite = Math.min(iRed, iYellow, iBlue);

  iRed -= iWhite;
  iYellow -= iWhite;
  iBlue -= iWhite;

  const iMaxYellow = Math.max(iRed, iYellow, iBlue);

  // Get the green out of the yellow and blue
  let iGreen = Math.min(iYellow, iBlue);

  iYellow -= iGreen;
  iBlue -= iGreen;

  if (iBlue > 0 && iGreen > 0) {
    iBlue *= 2.0;
    iGreen *= 2.0;
  }

  // Redistribute the remaining yellow.
  iRed += iYellow;
  iGreen += iYellow;

  // Normalize to values.
  const iMaxGreen = Math.max(iRed, iGreen, iBlue);

  if (iMaxGreen > 0) {
    const iN = iMaxYellow / iMaxGreen;

    iRed *= iN;
    iGreen *= iN;
    iBlue *= iN;
  }

  // Add the white back in.
  iRed += iWhite;
  iGreen += iWhite;
  iBlue += iWhite;

  // return [Math.floor(iRed), Math.floor(iGreen), Math.floor(iBlue)];
  return [iRed, iGreen, iBlue];
};
