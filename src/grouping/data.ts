import { ColorPropKey } from "./analyzeColors";

export interface ColorClassification {
  name: string;
  hexes: string[];
  definitions?: PropertyConstraint[];
}

export interface PropertyConstraint {
  property: ColorPropKey;
  min: number;
  max: number;
}

//todo: remove brown/beige that came from Pantone pastel collection

export const GROUPINGS: ColorClassification[] = [
  {
    name: "Neons",
    hexes: [
      "#009ace",
      "#44d62c",
      "#ffe900",
      "#ffaa4d",
      "#ff7276",
      "#ff3eb5",
      "#ea27c2",
      "#00aada",
      "#8de971",
      "#fff36d",
      "#ffcd8a",
      "#ff9da7",
      "#ff7cd6",
      "#f469db",
      "#00afdb",
      "#a9ee8a",
      "#fdf38a",
      "#ffd9a4",
      "#ffacb6",
      "#ff92da",
      "#f57fe0",
      "#00bce3",
      "#b9efa3",
      "#f7f4a2",
      "#ffdfb4",
      "#ffc0c8",
      "#ffade3",
      "#f8a3e6",
      "#00b796",
      "#e3e829",
      "#ffd635",
      "#ff8f6c",
      "#ff5fa2",
      "#fb48c4",
      "#8a69d4",
      "#00c0a3",
      "#ecf166",
      "#ffe671",
      "#ffad93",
      "#ff85bd",
      "#fc76d9",
      "#997adb",
      "#2bc9af",
      "#eef386",
      "#ffe983",
      "#ffbba4",
      "#ff9bcb",
      "#fc8de0",
      "#ab92e1",
      "#6dd5c3",
      "#eff4a4",
      "#fceea8",
      "#ffcfbe",
      "#ffb6d9",
      "#fca9e6",
      "#c0aee7",
      "#edeb00",
      "#ff7700",
      "#ff4131",
      "#f93753",
      "#00b131",
      "#edff21",
      "#f8f32b",
      "#ffff00",
      "#ff2301",
      "#f80000",
      "#fe0000",
      "#de4c8a",
      "#d72d6d",
      "#3b83bd",
      "#2271b3",
      "#00bb2d",
      "#eed82e",
      "#f9d922",
      "#f65b4f",
      "#247ecb",
      "#008eb5",
      "#208cb6",
      "#008fcd",
      "#0093bc",
      "#0094c5",
      "#03b4d6",
      "#83c748",
      "#86c747",
      "#f2d400",
      "#ffc100",
      "#ffb600",
      "#ff8c00",
      "#ff6b00",
      "#ff5d02",
      "#f94711",
      "#ed3422",
      "#ef181e",
      "#df252b",
      "#c90230",
      "#f43133",
      "#e1023b",
      "#c2154c",
      "#cf004f",
      "#b90065",
      "#d9007f",
      "#b1004f",
      "#8f1980",
      "#c00079",
      "#c0005f",
      "#a400a5",
      "#0081ce",
      "#0086be",
      "#00b2dc",
      "#68b500",
      "#5cbd00",
      "#d6cb00",
      "#f9dc13",
      "#ffd800",
      "#ffc900",
      "#ffbc06",
      "#ff9e1c",
      "#ff7d21",
      "#ff6b2b",
      "#f6502f",
      "#ec4e3b",
      "#ed3a40",
      "#e13f41",
      "#d53049",
      "#ec4446",
      "#d82740",
      "#d83866",
      "#cf2d5b",
      "#bf2f6c",
      "#d42975",
      "#a42b93",
      "#c2387c",
      "#c83375",
      "#a13397",
      "#0f69b5",
      "#0080ae",
      "#0084b2",
      "#007cbf",
      "#0081b1",
      "#00b4d6",
      "#7dbb2a",
      "#86c12e",
      "#d4ba28",
      "#d6ca18",
      "#e4cd2b",
      "#e6c930",
      "#eb6141",
      "#dd4f49",
      "#d34887",
      "#2170b3",
      "#1c73ae",
      "#008bba",
      "#0094b3",
      "#33a4ba",
      "#0098a5",
      "#00aa90"
    ],
    definitions: [
      /**
       * luminosity & hue have no corelation to neonness
       */
      {
        property: "blackness",
        min: 0,
        max: 37
        /**
         * pinks and yellows have lower whiteness than blues, regardless of saturation.
         * the highest values at 35 to 37 are for neon purples
         */
      },
      {
        property: "whiteness",
        min: 0,
        max: 25
        /*
         * most neons have whiteness below 25, with 0 being a true neon,
         * the current set includes many outside of that range, with values as high as 75,
         * but these could be moved to another category - either candy for the highest or brights for the intermediate
         * the reason to keep them would be to make the palette less blinding
         */
      },
      {
        property: "saturationv",
        min: 60,
        max: 100
        /**
         * this is a CLEAR indicator of neon-ness
         * the cutoff is arbitrary, but the higher the value the more neon
         */
      },
      {
        property: "saturationl",
        min: 50,
        max: 100
        /**
         * this does not sort for neon-ness in the way that saturationv does,
         * but all values include the more pastel ones are over 50
         */
      },
      {
        property: "lightness",
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
    hexes: [
      "#ffffff",
      "#f8faf8",
      "#fafdf4",
      "#f4f8e7",
      "#f0eddb",
      "#f0f2f1",
      "#eae9e1",
      "#f0eee2",
      "#e4e2d3",
      "#fbf8e7",
      "#ece6d1",
      "#e5dfc9",
      "#d9d9c8",
      "#e7fced",
      "#d7e2e5",
      "#e0ede6",
      "#dae2dd",
      "#f8e7c9",
      "#fff5d1",
      "#fef2c2",
      "#fff0c2",
      "#eeda9c",
      "#edd79a",
      "#d2d1ad",
      "#c9cdbf",
      "#d0d3b2",
      "#c9cfb5",
      "#cdd9c2",
      "#d8dbac",
      "#bcc8bc",
      "#c1cdcd",
      "#cec4c5",
      "#c9cabd",
      "#d5d3bf",
      "#9aa29c",
      "#c3c3c3",
      "#d0d0d0",
      "#faf4e3",
      "#e7ebda",
      "#f4f4f4",
      "#f1f0d8",
      "#f5e2e2",
      "#f2dee9",
      "#e7dcea",
      "#d5ebee",
      "#d7efe7",
      "#f1f1de",
      "#f2ebe7",
      "#f2e9ea",
      "#eee9ea",
      "#e6eeec",
      "#e7efe7",
      "#dfdcd4",
      "#e8e6df",
      "#e4e2db",
      "#e7e7e0",
      "#e3e3dd",
      "#d9dbd5",
      "#d5d8d2",
      "#d2cdc3",
      "#f1f0b0",
      "#f1efb7",
      "#f2edc0",
      "#e9e4c5",
      "#e7dbb9",
      "#e3dfc3",
      "#e2d9c2",
      "#f4e5c0",
      "#f3e4cd",
      "#f4e3c9",
      "#f5e1cc",
      "#f5e3cc",
      "#f5e0cf",
      "#edd6c4",
      "#efe4ce",
      "#ede1cf",
      "#eddecd",
      "#ecdcc8",
      "#e5d7c5",
      "#e4d5c4",
      "#e1d3c4",
      "#f2e9db",
      "#f0e6d8",
      "#ebe3d7",
      "#e6d5c8",
      "#e1d3c7",
      "#e9d5cd",
      "#e1cec6",
      "#f3e9e2",
      "#f4e5de",
      "#f5deda",
      "#f0ddd7",
      "#efd7d4",
      "#ead5d2",
      "#e4d1cd",
      "#f6dfe0",
      "#f2ddde",
      "#f4dde2",
      "#efdadb",
      "#f0dbe1",
      "#edd5e2",
      "#e9ced5",
      "#f1e7e4",
      "#f0e7e9",
      "#eae3ea",
      "#e9d8d7",
      "#e7d2d6",
      "#e9d0dc",
      "#e2ccd6",
      "#ded8eb",
      "#e3d7e6",
      "#e0d4e2",
      "#ded1e1",
      "#dcd3e7",
      "#dcd4e5",
      "#d1c7d9",
      "#dee1ec",
      "#dadfec",
      "#d2d9e8",
      "#cdd2e6",
      "#d1d5e3",
      "#ced5df",
      "#ced9e4",
      "#d6e1ec",
      "#d5e1ed",
      "#d5e0ea",
      "#d1e2ec",
      "#cedfe9",
      "#cad9e3",
      "#c0d1da",
      "#c3e3e7",
      "#c1e0ea",
      "#c0e0ec",
      "#bedde7",
      "#bee2e7",
      "#b9dbe0",
      "#b9d5de",
      "#c8e9e9",
      "#c5e9ea",
      "#bee9e7",
      "#c1e3e4",
      "#b9e0dd",
      "#c6dcda",
      "#bddadd",
      "#e3e8e3",
      "#dfece4",
      "#dcebec",
      "#c9e2e0",
      "#c8deda",
      "#cbdeda",
      "#c6dad7",
      "#e5efe2",
      "#e1f0e5",
      "#dfece2",
      "#d5e9e1",
      "#d6e6df",
      "#d6e3dc",
      "#cde3e0",
      "#e5efda",
      "#dfefdb",
      "#d7e8d2",
      "#d6e2cf",
      "#d5ddce",
      "#cddacd",
      "#c7d7c9",
      "#eeeec8",
      "#e7edc8",
      "#e5e8cd",
      "#e4e2b7",
      "#d9dbbd",
      "#d9d9c3",
      "#dcd9b9",
      "#e1efce",
      "#dee7cd",
      "#dce1cb",
      "#d7dbc8",
      "#cdd2ba",
      "#d7dbc6",
      "#d8cfb9",
      "#f7a879",
      "#b7b1dc"
    ],
    definitions: [
      /*
       * hue and saturationl can have any value
       * saturation could be differentiator between serene neutral pastels and unicorn/candy pastels
       */
      {
        property: "luminosity",
        min: 0.54,
        max: 0.9 //could go up to 1, but but then it's basically just white
      },
      { property: "lightness", min: 75, max: 95 },
      { property: "saturationv", min: 0, max: 25 },
      { property: "blackness", min: 0, max: 24 },
      { property: "whiteness", min: 7, max: 95 }
    ]
  },
  {
    name: "Candy",
    hexes: [
      "#fbefbb",
      "#fae39f",
      "#dbe8a7",
      "#dde5a9",
      "#ccce7a",
      "#a2c8a1",
      "#cfe9e0",
      "#bbd0d2",
      "#c5d7d2",
      "#a6cdc2",
      "#ade8e2",
      "#ccdce7",
      "#cae9ee",
      "#bde1dd",
      "#b4cbd9",
      "#9cc7c4",
      "#fcba7d",
      "#f1a1a6",
      "#f7dde0",
      "#e3dbf2",
      "#fad666",
      "#ff9c7e",
      "#fd8999",
      "#f8d66a",
      "#ff916e",
      "#fd778f",
      "#ffdc68",
      "#ff9879",
      "#f77486",
      "#f2f0a1",
      "#fcaebb",
      "#f1b2dc",
      "#bf9bde",
      "#74d1ea",
      "#9de7d7",
      "#f2eeca",
      "#fac9d1",
      "#f3c9e4",
      "#d1b6e4",
      "#9fdded",
      "#afeadc",
      "#f2d964",
      "#f4af5b",
      "#faa495",
      "#df8686",
      "#bf7595",
      "#9b8cb5",
      "#75c89e",
      "#e6d690",
      "#efa94a",
      "#d36e70",
      "#ea899a",
      "#a47d90",
      "#8673a1",
      "#6c6881",
      "#bdecb6",
      "#89ac76",
      "#84c3be"
    ],
    definitions: [
      /**
       * hue, saturationl, luminosity, not related
       */
      {
        property: "blackness",
        min: 0,
        max: 15
        /*
         * current group includes some up to 35,
         * but this is a good sorting indicator with the core of the group < 10
         * note that red/orange/yellow have lower values, a very candy purple is 12
         */
      },
      {
        property: "whiteness",
        min: 39,
        max: 90
      },
      {
        property: "saturationv",
        min: 0,
        max: 50
      },
      {
        property: "lightness",
        min: 60,
        max: 95
      }
    ]
  },
  {
    name: "Neutrals",
    hexes: [
      "#f4dea8",
      "#e9d19e",
      "#e1c9a1",
      "#dfbd87",
      "#ca9f5e",
      "#af8a3a",
      "#ceaa5b",
      "#c9b156",
      "#b29445",
      "#c1b98f",
      "#bcb472",
      "#998f5b",
      "#969873",
      "#696346",
      "#a16941",
      "#e1d6bb",
      "#c1a878",
      "#cbc6b1",
      "#bdb091",
      "#a89d7e",
      "#746d5a",
      "#a3977f",
      "#675544",
      "#5b8463",
      "#878751",
      "#6a925c",
      "#c08e55",
      "#9f774a",
      "#947c4b",
      "#7c6654",
      "#886a5a",
      "#996552",
      "#b9694c",
      "#9f6358",
      "#835c55",
      "#b1a695",
      "#9da6a2",
      "#757776",
      "#98978e",
      "#807d77",
      "#5a5b1d",
      "#b0762f",
      "#8b5f2a",
      "#765e28",
      "#a79b89",
      "#99a19b",
      "#929188",
      "#76766f",
      "#856945",
      "#787940",
      "#b57e40",
      "#997042",
      "#8d7545",
      "#725547",
      "#a59984",
      "#8f9085",
      "#8a8780",
      "#858549",
      "#92604c",
      "#e6c9a2",
      "#ba9873",
      "#8f6e46",
      "#d0c092",
      "#b97d31",
      "#624a3e",
      "#8e7a5a",
      "#7b584c",
      "#bebd7f",
      "#c2b078",
      "#c6a664",
      "#8a6642",
      "#6a5d4d",
      "#705335",
      "#6c7156",
      "#7e7b52",
      "#6d6552",
      "#6a5f31",
      "#8b8c7a",
      "#b8b799",
      "#7d8471",
      "#8f8b66",
      "#cac4b0",
      "#898176",
      "#5b3a29",
      "#79553d",
      "#755c48"
    ],
    definitions: [
      /**
       * whiteness/lightness not correlated.  current set caps at 73 but there is no reason that pastel neutrals can't go here as well
       */
      {
        property: "blackness",
        min: 0,
        max: 65
      },
      {
        property: "saturationv",
        min: 0,
        max: 75
        /**
         * not a strong correlation, but don't want neons
         */
      },
      {
        property: "saturationl",
        min: 0,
        max: 65
      },
      {
        property: "hue",
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
    hexes: [
      "#eabe5b",
      "#ffba38",
      "#c3d263",
      "#b0c05d",
      "#83ae82",
      "#cf8744",
      "#ff963a",
      "#df892a",
      "#c68736",
      "#c27136",
      "#c27355",
      "#ba4133",
      "#b8352e",
      "#aa3e71",
      "#ffc527",
      "#ffc037",
      "#ffa43c",
      "#ff813c",
      "#ff893e",
      "#ff7441",
      "#fd6b44",
      "#ef5e49",
      "#f55a4f",
      "#e55149",
      "#e3495a",
      "#e64e5b",
      "#dd4e6e",
      "#d5487a",
      "#d24a85",
      "#dd3f8e",
      "#b03f9a",
      "#cf448e",
      "#db3f81",
      "#ad41a8",
      "#844aa3",
      "#5a5199",
      "#7753a9",
      "#4a6aad",
      "#435fbc",
      "#286bbb",
      "#157abc",
      "#5861a2",
      "#009ca8",
      "#00b59d",
      "#009c75",
      "#00927a",
      "#279e6c",
      "#00969c",
      "#57a854",
      "#44ac57",
      "#56b650",
      "#d3bb3e",
      "#dbd240",
      "#dda14f",
      "#db974a",
      "#d57248",
      "#6b278c",
      "#58278c",
      "#0059bc",
      "#0077a9",
      "#0073b1",
      "#00929d",
      "#00b28f",
      "#d4b700",
      "#dd9728",
      "#d48105",
      "#c25526",
      "#774291",
      "#6a468d",
      "#006ab3",
      "#007dac",
      "#00909b",
      "#008089",
      "#4a993f",
      "#28a144",
      "#50b543",
      "#e29e3e",
      "#dc9035",
      "#cd6740",
      "#b65b42",
      "#ecba38",
      "#edb43e",
      "#f2a142",
      "#f4873d",
      "#f17842",
      "#e35340",
      "#e45447",
      "#e65d56",
      "#dc4f57",
      "#ca555a",
      "#994e5a",
      "#d74e54",
      "#cb496b",
      "#a4469c",
      "#805296",
      "#4364a6",
      "#4465ab",
      "#367f9f",
      "#009b6f",
      "#0e9173",
      "#5da04b",
      "#419d53",
      "#4db051",
      "#80bd47",
      "#76b83d",
      "#e19d3b",
      "#dc933e",
      "#b9674d",
      "#fad140",
      "#f59724",
      "#f07b42",
      "#e87257",
      "#da5838",
      "#776bab",
      "#7b598f",
      "#87c8d7",
      "#4eb3cd",
      "#1882b4",
      "#7ab96e",
      "#42a370",
      "#40b8a4",
      "#009f8a",
      "#e5be01",
      "#e4a010",
      "#dc9d00",
      "#f4a900",
      "#d6ae01",
      "#f3a505",
      "#f39f18",
      "#ed760e",
      "#c93c20",
      "#cb2821",
      "#f44611",
      "#ffa420",
      "#f75e25",
      "#f54021",
      "#d84b20",
      "#ec7c26",
      "#e55137",
      "#c35831",
      "#af2b1e",
      "#a12312",
      "#b32821",
      "#e63244",
      "#d53032",
      "#d95030",
      "#c51d34",
      "#cb3234",
      "#b32428",
      "#b44c43",
      "#6d3f5b",
      "#6c4675",
      "#a03472",
      "#924e7d",
      "#3e5f8a",
      "#025669",
      "#606e8c",
      "#3f888f",
      "#1b5583",
      "#256d7b",
      "#49678d",
      "#5d9b9b",
      "#2a6478",
      "#287233",
      "#4c9141",
      "#57a639",
      "#308446",
      "#317f43",
      "#497e76",
      "#7fb5b5"
    ],
    definitions: [
      /**
       * saturationl, hue, not correlated
       */
      {
        property: "luminosity",
        min: 0,
        max: 0.65
        /**
         * a filterer but not a correlator -- lowest values are purple and highest are yellow
         */
      },
      {
        property: "lightness",
        min: 25,
        max: 65
        /**
         * again skewed by hue with blue low and ROY high
         */
      },
      {
        property: "saturationv",
        min: 40,
        max: 100
        /**
         * strong correlation
         * but can be skewed a little by color. some blues and purples appear bright despite lower values, ( ie. #87c8d7)
         * but other bluess can and do have 100 saturation
         */
      },
      {
        property: "blackness",
        min: 0,
        max: 50
        /**
         * some correlation, but skewed by yellow/blue bias
         */
      },
      {
        property: "whiteness",
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
    hexes: [
      "#ff0000",
      "#feda00",
      "#00379a",
      "#0033bb",
      "#0055aa",
      "#008600",
      "#009020",
      "#00a500",
      "#2655ac",
      "#0d59ab",
      "#fdad00",
      "#f5d033",
      "#f3da0b",
      "#fad201",
      "#ff7514",
      "#cc0605",
      "#063971",
      "#102c54",
      "#008f39"
    ],
    definitions: [
      /**
       * no relation to luminosity or hue
       */
      {
        property: "whiteness",
        min: 0,
        max: 20
        /**
         * strong correlation
         */
      },
      {
        property: "blackness",
        min: 0,
        max: 60
        /**
         * filters but doesn't correlate
         */
      },
      {
        property: "saturationv",
        min: 75,
        max: 100
        /**
         * strong correlation
         */
      },
      {
        property: "saturationl",
        min: 60,
        max: 100
        /**
         * strong correlation
         */
      },
      {
        property: "lightness",
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
    hexes: [
      "#6e7e60",
      "#82979d",
      "#587675",
      "#485761",
      "#8c4d35",
      "#752b22",
      "#7c2a1c",
      "#8b8a8c",
      "#6f595d",
      "#848a86",
      "#535654",
      "#3f4647",
      "#312f24",
      "#313536",
      "#bc5959",
      "#c45163",
      "#a64c5b",
      "#545f77",
      "#4c5d79",
      "#5c7a5c",
      "#544e4b",
      "#635a52",
      "#575c62",
      "#535451",
      "#533d2c",
      "#5b3928",
      "#743928",
      "#78382f",
      "#63322e",
      "#495057",
      "#343831",
      "#41546a",
      "#364e6d",
      "#47704f",
      "#446344",
      "#645243",
      "#8c5745",
      "#8b4d45",
      "#7a4f4a",
      "#43403e",
      "#544946",
      "#6a7070",
      "#535a5f",
      "#414440",
      "#4c566c",
      "#506077",
      "#547353",
      "#715b47",
      "#785847",
      "#75151e",
      "#5e2129",
      "#351f21",
      "#642424",
      "#781f19",
      "#6e1c34",
      "#4a192c",
      "#1f3438",
      "#1d1e33",
      "#18171c",
      "#26252d",
      "#0e294b",
      "#231a24",
      "#1e213d",
      "#1d334a",
      "#424632",
      "#1f3a3d",
      "#2f4538",
      "#3e3b32",
      "#343b29",
      "#39352a",
      "#31372b",
      "#343e40",
      "#47402e",
      "#3b3c36",
      "#2e3a23",
      "#25221b",
      "#193737",
      "#4c514a",
      "#434b4d",
      "#4e5754",
      "#464531",
      "#434750",
      "#293133",
      "#23282b",
      "#332f2c",
      "#474a51",
      "#2f353b",
      "#474b4e",
      "#4e5452",
      "#826c34",
      "#955f20",
      "#6c3b2a",
      "#734222",
      "#8e402a",
      "#59351f",
      "#592321",
      "#633a34",
      "#4c2f27",
      "#45322e",
      "#403a3a",
      "#212121",
      "#a65e2e",
      "#4e3b31",
      "#763c28",
      "#282828",
      "#bd413a",
      "#9a4039",
      "#583f40",
      "#a25877",
      "#334059",
      "#4e795b",
      "#515545",
      "#415448",
      "#889099",
      "#383737"
    ],
    definitions: [
      {
        property: "luminosity",
        min: 0,
        max: 0.2
        /**
         * strong correlation
         * outliers are lighter gray-blues, better suited elsewhere
         */
      },
      {
        property: "lightness",
        min: 10,
        max: 50
        /**
         * strong correlation, with target around 25
         */
      },
      {
        property: "saturationl",
        min: 0,
        max: 70
        /**
         * not much correlation
         */
      },
      {
        property: "saturationv",
        min: 0,
        max: 85
        /**
         * not much correlation
         */
      },
      {
        property: "blackness",
        min: 20,
        max: 90
        /**
         * not much correlation
         */
      },
      {
        property: "whiteness",
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
    hexes: [
      "#128458",
      "#18887c",
      "#0e707b",
      "#1f4992",
      "#942a35",
      "#67272a",
      "#5e3d5a",
      "#652f53",
      "#c44b68",
      "#6d508f",
      "#00988d",
      "#388375",
      "#a02031",
      "#9f1438",
      "#701a32",
      "#443188",
      "#4f2778",
      "#122e45",
      "#1a3553",
      "#454c99",
      "#008578",
      "#00834d",
      "#007151",
      "#005a4c",
      "#007a3b",
      "#295b34",
      "#007577",
      "#254d2a",
      "#9e3d21",
      "#ad3a45",
      "#a93b50",
      "#954152",
      "#b33859",
      "#524993",
      "#644385",
      "#475696",
      "#008c7f",
      "#00a686",
      "#009368",
      "#007b63",
      "#156459",
      "#008554",
      "#5c8649",
      "#6d4f99",
      "#238e5b",
      "#688c4c",
      "#195584",
      "#007856",
      "#009185",
      "#a52019",
      "#a2231d",
      "#9b111e",
      "#721422",
      "#922b3e",
      "#2a2e4b",
      "#20214f",
      "#1e2d6e",
      "#252850",
      "#316650",
      "#2d572c",
      "#35682d",
      "#587246",
      "#1e5945",
      "#3d642d",
      "#015d52",
      "#2c5545",
      "#20603d",
      "#1c542d"
    ],
    definitions: [
      /**
       * blackness not correlated
       */
      {
        property: "saturationl",
        min: 20,
        max: 100
      },
      {
        property: "saturationv",
        min: 30,
        max: 100
      },
      {
        property: "whiteness",
        min: 0,
        max: 35
      },
      {
        property: "lightness",
        min: 15,
        max: 50
      },
      {
        property: "luminosity",
        min: 0,
        max: 25
        /**
         * strongest correlation
         */
      },
      {
        property: "hue",
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
