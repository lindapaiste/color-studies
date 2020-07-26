import React, {useState} from "react";
import {ColorSpaceName} from "../../spacesChannels/types";
import {ModelPalette} from "./ModelPalette";
import {Title} from "../../sharedComponents/ui/Title";
import MultiSelectModel from "../../sharedComponents/form/MultiSelectModel";
import {ModelAdapter} from "../../spacesChannels/ModelAdapter";

/**
 * this does work, but selecting too many leads to a call stack size exceeded error
 * reduced from 1000 (10^3) per to 512 (8^3) per
 */
export const PaletteCompareTool = () => {
    const [models, setModels] = useState<ModelAdapter<ColorSpaceName>[]>([]);

    return (
        <div>
            <MultiSelectModel
                value={models}
                onChange={setModels}
            />
            <div>
                {models.map(model => (
                    <div key={model.key}>
                        <Title>{model.title}</Title>
                        <ModelPalette
                            model={model}
                            totalCount={512}
                            perRow={32}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
