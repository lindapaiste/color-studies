import {
    PackageUtil,
    PackageDefs,
    ColorPropKey,
    ColorPropDef,
    ColorPropGetter,
    ColorPropSetter,
    ColorProfile
} from "./types";

export const makePackageUtil = <T>(properties: PackageDefs<T>): PackageUtil<T> => {

    const propertyKeys = (properties.map(o => o.key ));

    const getPropDef = (property: ColorPropKey): ColorPropDef<T> => {
        return properties.find( o => o.key === property) as ColorPropDef<T>; //should always find a match
    };

    const getTitle = (property: ColorPropKey): string => {
        return getPropDef(property).name;
    };

    const getMaximum = (
        property: ColorPropKey,
        color: T,
    ): number => {
        //need to handle when range is a function
        const range = getPropDef(property).range;
        return typeof range === "number" ? range : range(color);
    };

    const getAllowance = (
        property: ColorPropKey,
        fuzzPercent: number,
        color: T,
    ): number => {
        return (getMaximum(property, color) * fuzzPercent) / 100;
    };

    const getGetter = (property: ColorPropKey): ColorPropGetter<T> => {
        return getPropDef(property).getter;
    };
    const getColorProp = (color: T, property: ColorPropKey): number => {
        return getGetter(property)(color);
    };
    const getSetter = (property: ColorPropKey): ColorPropSetter<T> => {
        return getPropDef(property).setter;
    };
    const setColorProp = (
        color: T,
        property: ColorPropKey,
        value: number
    ): T => {
        return getSetter(property)(color, value);
    };

    const getProfile = (color: T): ColorProfile => {
      return Object.fromEntries( properties.map( o => [o.key, o.getter(color)])) as ColorProfile;
    };

    return {
        propertyKeys,
        getTitle,
        getPropDef,
        getMaximum,
        getAllowance,
        getGetter,
        getSetter,
        getColorProp,
        setColorProp,
        getProfile,
    }

};
