import {rybToRgb, rgbToRyb} from "./ryb-convert";

/**
 * the conversion model here has different results which I do not like as much
 * but need to test it to its own expected outputs
 */

test("magenta from [1,0,1] RGB to [1,0,1] RYB", () => {
    expect( rgbToRyb([1, 0, 1])).toEqual([1,0,1]);
})

test("cyan from [127,255,255] RGB to [127, 191, 255] RYB", () => {
    expect( rgbToRyb( [127,255,255])).toEqual([127, 191, 255]);
})

test("green from [0,1,1] RYB to [0,1,0] RGB", () => {
    expect( rybToRgb( [0,1,1])).toEqual( [0,1,0]);
})

test("yellow from [0,255,0] RYB to [255,255,0] RGB", () => {
    expect( rybToRgb( [0,255,0])).toEqual(  [255,255,0]);
})

