import { sampleSize, typedValues } from "lib";
import { COLOR_SPACE_NAMES, ColorSpaceName } from "./colorSpaces";
import { ModelAdapter } from "./ModelAdapter";

/**
 * Union type for either a model name or model object
 */
export type ModelArg<CS extends ColorSpaceName = ColorSpaceName> =
  | CS
  | ModelAdapter<CS>;

/**
 * keyed by color space name
 */
const KEYED_MODEL_OBJECTS = Object.fromEntries(
  COLOR_SPACE_NAMES.map((name) => [name, new ModelAdapter(name)])
) as Record<ColorSpaceName, ModelAdapter>;

/**
 * use a getter outside the class so that I can possibly store locally to minimize repeat creation
 * callers of the function do not need to know how the model is retrieved
 */
export const getModel = <CS extends ColorSpaceName>(
  name: CS
): ModelAdapter<CS> => KEYED_MODEL_OBJECTS[name] as ModelAdapter<CS>;

/**
 * get an array of all model objects
 */
export const allModels = () => typedValues(KEYED_MODEL_OBJECTS);

/**
 * get an array containing n random models -- useful for initialSettings
 */
export const randomModels = (n: number) => sampleSize(allModels(), n);

/**
 * get an array of all model names - prefer function over exporting constant
 */
export const allModelNames = () => COLOR_SPACE_NAMES;

/**
 * helper to get a model adapter from a prop which is either a name or an object
 */
export const toModelAdapter = <CS extends ColorSpaceName>(
  value: ModelArg<CS>
): ModelAdapter<CS> => (typeof value === "string" ? getModel(value) : value);

/**
 * helper to get a model name from a prop which is either a name or an object
 */
export const toModelName = <CS extends ColorSpaceName>(
  value: ModelArg<CS>
): CS => (typeof value === "string" ? value : value.name);
