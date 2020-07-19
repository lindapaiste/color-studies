import {ColorProfile} from "./types";
import chroma, {Color} from "chroma-js";
import {normalToColorWheel} from "../rainbow/colorWheel";

/**
 * I don't think I need to lazy-load property values because the internal class should handle it
 */
export class ChromaAdapter implements ColorProfile {

    public internal: Color;

    public constructor(color: string | number) {
        this.internal = chroma(color);
    }

    get lightness() {
        return this.internal.get('hsl.l');
    }

    get saturationHsl() {
        return this.internal.get('hsl.s');
    }

    get saturationHsv() {
        return this.internal.get('hsv.s');
    }

    get blackness() {
        return this.internal.get('cmyk.k');
    }

    get whiteness() {
        return 0; //TODO
    }

    get luminosity() {
        return this.internal.luminance();
    }

    get hue() {
        return this.internal.get('hsl.h')
    }

    get wheelHue() {
        return normalToColorWheel(this.hue);
    }
}
