import chroma, {Color} from "chroma-js";
import {ColorSpaceName} from "./colorSpaces";
import convert from "color-convert";

export class ConvertAdapter {

    public internal: Color;

    public constructor(color: string | number) {
        this.internal = chroma(color);
    }

    public get( colorSpace: ColorSpaceName, rounded: boolean = false ) {
        switch ( colorSpace ) {
            case 'hwb':
                return convert.rgb.hwb.raw(this.internal.rgb(false))
        }
    }
}
