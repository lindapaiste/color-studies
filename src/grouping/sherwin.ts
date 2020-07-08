import { getGroupData } from "./analyzeColors";
import { randomRgb } from "../rgb";
import { RGB } from "../util";

//random set of RGBs
const createBaseline = (count: number = 8): RGB[] => {
  return [...new Array(count)].map(randomRgb);
};

//SW seelector [...document.querySelectorAll('rect')].map(node => node.attributes.fill.value)

//from: https://www.sherwin-williams.com/architects-specifiers-designers/facility-solutions/healthcare/healthcare-color-collection/calm-comfort
const SW_CALM_COMFORT = [
  "rgb(205, 210, 202)",
  "rgb(200, 191, 181)",
  "rgb(170, 186, 198)",
  "rgb(220, 199, 179)",
  "rgb(209, 183, 168)",
  "rgb(155, 175, 178)",
  "rgb(236, 211, 179)",
  "rgb(173, 187, 178)"
];

//https://www.sherwin-williams.com/architects-specifiers-designers/facility-solutions/commercial/commercial-color-collection/vibrant-splash
const SW_VIBRANT_SPLASH = [
  "rgb(1, 145, 150)",
  "rgb(199, 99, 86)",
  "rgb(200, 79, 104)",
  "rgb(1, 80, 134)",
  "rgb(247, 215, 138)",
  "rgb(206, 188, 85)",
  "rgb(244, 160, 69)",
  "rgb(220, 222, 220)"
];

export const compareGroups = () => {
  console.log("Calm Comfort");
  console.log(getGroupData(SW_CALM_COMFORT));
  console.log("Vibrant Splash");
  console.log(getGroupData(SW_VIBRANT_SPLASH));
  console.log("Baseline");
  console.log(getGroupData(createBaseline(8)));
};
