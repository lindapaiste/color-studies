import {FormulaSettings, I_FormulaClass} from "./types";
import {useState} from "react";
import {Formula} from "./Formula";

/**
 * rather than just updating a settings object,
 * it returns a calculator class which responds to updates
 */
export const useFormula = (initialSettings: Partial<FormulaSettings> = {}): [I_FormulaClass, (changes: Partial<FormulaSettings>) => void] => {
    const [formula, setFormula] = useState( new Formula(initialSettings) );

    const handleChanges = (changes: Partial<FormulaSettings>): void => {
        setFormula( new Formula({...formula, ...changes}));
    }

    return [formula, handleChanges];
}
