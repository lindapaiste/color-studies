import React, {useCallback, useMemo} from "react";
import {getSplitSample} from "../../classifier/shuffledData";
import {ChannelAdapter} from "../../spacesChannels/ChannelAdapter";
import {hexToColor} from "../../color";
import {GroupedHex} from "../../classifier/types";
import {CartesianGrid, Legend, Scatter, ScatterChart, Tooltip, XAxis, YAxis} from "recharts";
import {Size} from "../../sharedComponents/form/types";
import {Swatch} from "../../sharedComponents/color/Swatch";
import {I_ColorAdapter} from "../../color/types";
import {ChannelAccessor} from "../../spacesChannels/types";

/**
 * creates a scatter plot based on two color properties (x and y)
 *
 * the plot has two data sets -- comparing those in the specified group to those outside of it
 *
 * the PlotFeatures component creates the data itself from a random sampling
 * based on group and count props
 */

export interface Props {
    colorCount: number;
    xChannel: ChannelAdapter;
    yChannel: ChannelAdapter;
    group: string;
}

/**
 * Get an x and a y from a color.  Is also used in ChannelRelPlot.
 */
export const colorToPoint = (
    xChannel: ChannelAdapter | ChannelAccessor,
    yChannel: ChannelAdapter | ChannelAccessor
) =>
    (color: I_ColorAdapter) =>
        ({
            x: color.get(xChannel, false, 2),
            y: color.get(yChannel, false, 2),
            hex: color.hex()
        });

export const PlotFeatures = ({colorCount, xChannel, yChannel, group, width, height}: Props & Size) => {

    // keep the same colors when changing x or y channels
    const [inGroup, notInGroup] = useMemo(
        () => getSplitSample(group, colorCount),
        [group, colorCount]
    );

    // convert colors to x/y points
    const toData = useCallback(
        (data: GroupedHex[]) =>
            data.map(({hex}) => hexToColor(hex))
                .map(colorToPoint(xChannel, yChannel)),
        [xChannel, yChannel]
    );

    // memoized data arrays
    const [dataIn, dataOut] = useMemo(() => {
        return [toData(inGroup), toData(notInGroup)]
    }, [inGroup, notInGroup, toData]);

    return (
        <ScatterChart width={width} height={height}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="x" name={xChannel.name} label={xChannel.name} type="number"/>
            <YAxis dataKey="y" name={yChannel.name} label={yChannel.name} type="number"/>
            <Tooltip
                // TODO: color swatch stopped appearing -- fix
                labelFormatter={(_, [x]) => <Swatch color={x?.payload.hex} size={75} height={30}/>}
            />
            <Legend/>
            <Scatter name={group} data={dataIn} fill="#1ad900"/>
            <Scatter name={`Not ${group}`} data={dataOut} fill="#8f8f8f"/>
        </ScatterChart>
    )
};
