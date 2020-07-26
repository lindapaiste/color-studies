import {ColorSpaceName} from "./types";
import {useState} from "react";
import {ModelAdapter} from "./ModelAdapter";
import {eitherToModel, getModel} from "./models";

export type UseModelHook = [ModelAdapter<ColorSpaceName>, (name: ColorSpaceName) => void]

/**
 * hook which allows updating of model object from name
 * initialValue can be a nome or an object
 */
export const useModel = (initialValue: ColorSpaceName | ModelAdapter<ColorSpaceName>): UseModelHook => {
    const [model, setModel] = useState(eitherToModel(initialValue));

    const setName = (name: ColorSpaceName): void => setModel(getModel(name));

    return [model, setName];
}
