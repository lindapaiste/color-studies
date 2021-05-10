import {StoredGroup} from "./types";
//todo: remove brown/beige that came from Pantone pastel collection

export const GROUPINGS: StoredGroup[] = [
  {
    name: "Neons",
    correlatedChannels: [ 'hcg.c', 'hsi.i', 'hsl.l', 'hsi.s', 'hsv.s', 'hwb.w', ],
    definitions: [
      /**
       * luminosity & hue have no correlation to neonness
       */
      {
        channel: "cmyk.k",
        min: 0,
        max: 37
        /**
         * pinks and yellows have lower hwb.w than blues, regardless of saturation.
         * the highest values at 35 to 37 are for neon purples
         */
      },
      {
        channel: "hwb.w",
        min: 0,
        max: 25
        /*
         * most neons have hwb.w below 25, with 0 being a true neon,
         * the current set includes many outside of that range, with values as high as 75,
         * but these could be moved to another category - either candy for the highest or brights for the intermediate
         * the reason to keep them would be to make the palette less blinding
         */
      },
      {
        channel: "hsv.s",
        min: 60,
        max: 100
        /**
         * this is a CLEAR indicator of neon-ness
         * the cutoff is arbitrary, but the higher the value the more neon
         */
      },
      {
        channel: "hsl.s",
        min: 50,
        max: 100
        /**
         * this does not sort for neon-ness in the way that saturationv does,
         * but all values include the more pastel ones are over 50
         */
      },
      {
        channel: "hsl.l",
        min: 32,
        max: 65
        /**
         * blues start at 32, reds are more like 50, and those above 65 can be reclassified
         */
      }
    ]
  },
  {
    name: "Pastels",
    definitions: [
      /*
       * hue and saturationHsl can have any value
       * saturation could be differentiator between serene neutral pastels and unicorn/candy pastels
       */
      {
        channel: "xyz.y", //luminosity
        min: 54,
        max: 90 //could go up to 100, but but then it's basically just white
      },
      { channel: "hsl.l", min: 75, max: 95 },
      { channel: "hsv.s", min: 0, max: 25 },
      { channel: "cmyk.k", min: 0, max: 24 },
      { channel: "hwb.w", min: 7, max: 95 }
    ]
    /**
     * found a really good perceptron with weights
     *
     Luminosity (HSLUV)	4.58663061143214
     Chroma (HCG)	-4.556862745098037
     Bias	-3
     */
  },
  {
    name: "Candy",
    definitions: [
      /**
       * hue, hsl.s, luminosity, not related
       */
      {
        channel: "cmyk.k",
        min: 0,
        max: 15
        /*
         * current group includes some up to 35,
         * but this is a good sorting indicator with the core of the group < 10
         * note that red/orange/yellow have lower values, a very candy purple is 12
         */
      },
      {
        channel: "hwb.w",
        min: 39,
        max: 90
      },
      {
        channel: "hsv.s",
        min: 0,
        max: 50
      },
      {
        channel: "hsl.l",
        min: 60,
        max: 95
      }
    ]
  },
  {
    name: "Neutrals",
    definitions: [
      /**
       * hwb.w/hsl.l not correlated.  current set caps at 73 but there is no reason that pastel neutrals can't go here as well
       */
      {
        channel: "cmyk.k",
        min: 0,
        max: 65
      },
      {
        channel: "hsv.s",
        min: 0,
        max: 75
        /**
         * not a strong correlation, but don't want neons
         */
      },
      {
        channel: "hsl.s",
        min: 0,
        max: 65
      },
      {
        channel: "hsl.h",
        min: 0,
        max: 65
        /**
         * only reason to include outside this range would be if it is very gray
         */
      }
    ]
  },
  {
    name: "Brights",
    definitions: [
      /**
       * saturationHsl, hue, not correlated
       */
      {
        channel: "xyz.y", //luminosity
        min: 0,
        max: 65
        /**
         * a filterer but not a correlator -- lowest values are purple and highest are yellow
         */
      },
      {
        channel: "hsl.l",
        min: 25,
        max: 65
        /**
         * again skewed by hue with blue low and ROY high
         */
      },
      {
        channel: "hsv.s",
        min: 40,
        max: 100
        /**
         * strong correlation
         * but can be skewed a little by color. some blues and purples appear bright despite lower values, ( ie. #87c8d7)
         * but other bluess can and do have 100 saturation
         */
      },
      {
        channel: "cmyk.k",
        min: 0,
        max: 50
        /**
         * some correlation, but skewed by yellow/blue bias
         */
      },
      {
        channel: "hwb.w",
        min: 0,
        max: 35
        /**
         * strong correlation
         */
      }
    ]
  },
  {
    name: "Crayola",
    definitions: [
      /**
       * no relation to luminosity or hue
       */
      {
        channel: "hwb.w",
        min: 0,
        max: 20
        /**
         * strong correlation
         */
      },
      {
        channel: "cmyk.k",
        min: 0,
        max: 60
        /**
         * filters but doesn't correlate
         */
      },
      {
        channel: "hsv.s",
        min: 75,
        max: 100
        /**
         * strong correlation
         */
      },
      {
        channel: "hsl.s",
        min: 60,
        max: 100
        /**
         * strong correlation
         */
      },
      {
        channel: "hsl.l",
        min: 15,
        max: 60
        /**
         * filters but doesn't correlate
         */
      }
    ]
  },
  {
    name: "Dark & Moody",
    definitions: [
      {
        channel: "xyz.y", //luminosity
        min: 0,
        max: 20
        /**
         * strong correlation
         * outliers are lighter gray-blues, better suited elsewhere
         */
      },
      {
        channel: "hsl.l",
        min: 10,
        max: 50
        /**
         * strong correlation, with target around 25
         */
      },
      {
        channel: "hsl.s",
        min: 0,
        max: 70
        /**
         * not much correlation
         */
      },
      {
        channel: "hsv.s",
        min: 0,
        max: 85
        /**
         * not much correlation
         */
      },
      {
        channel: "cmyk.k",
        min: 20,
        max: 90
        /**
         * not much correlation
         */
      },
      {
        channel: "hwb.w",
        min: 0,
        max: 40
        /**
         * strong correlation
         */
      }
    ]
  },
  {
    name: "Jewel Tones",
    definitions: [
      /**
       * blackness not correlated
       */
      {
        channel: "hsl.s",
        min: 20,
        max: 100
      },
      {
        channel: "hsv.s",
        min: 30,
        max: 100
      },
      {
        channel: "hwb.w",
        min: 0,
        max: 35
      },
      {
        channel: "hsl.l",
        min: 15,
        max: 50
      },
      {
        channel: "xyz.y", //luminosity
        min: 0,
        max: 25
        /**
         * strongest correlation
         */
      },
      {
        channel: "hsl.h",
        min: 90,
        max: 360
        /**
         * note: this leaves off a few reds because I don't know how to account for the cyclical nature of hue.
         * curious to see what a very luminous orange or yellow looks like and if it makes sense to include them
         */
      }
    ]
  }
];

export default GROUPINGS;

