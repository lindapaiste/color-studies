import {ColorSpaceName} from "./types";
import {COLOR_SPACE_NAMES} from "./colorSpaces";
import {ModelAdapter} from "./ModelAdapter";
import {typedValues} from "../lib";

export type ModelOrName<CS extends ColorSpaceName> =  CS | ModelAdapter<CS>

type KeyedModelObjects = {
    [K in ColorSpaceName]-?: ModelAdapter<K>
};

const KEYED_MODEL_OBJECTS = Object.fromEntries(COLOR_SPACE_NAMES.map(name => [name, new ModelAdapter(name)])) as KeyedModelObjects;

/**
 * use a getter outside the class so that I can possibly store locally to minimize repeat creation
 * callers of the function do not need to know how the model is retrieved
 */
export const getModel = <CS extends ColorSpaceName>(name: CS): ModelAdapter<CS> => {
    return KEYED_MODEL_OBJECTS[name] as ModelAdapter<CS>;
    //return new ModelAdapter(name);
}

/**
 * get an array of all model objects
 */
export const allModels = () => typedValues(KEYED_MODEL_OBJECTS);

/**
 * helper to accept prop of either a name or an object
 */
export const eitherToModel = <CS extends ColorSpaceName>(value: ModelOrName<CS>): ModelAdapter<CS> => {
    return typeof value === "string" ? getModel(value) : value;
}

export const eitherToName= <CS extends ColorSpaceName>(value: ModelOrName<CS>): CS => {
    return typeof value === "string" ? value : value.name;
}
