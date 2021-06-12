import React from "react";
import { Button, Tooltip, Typography } from "@material-ui/core";
import { removeIndex, replaceIndex } from "@lindapaiste/array-edit";
import { ColorAdapter } from "logic/convert";
import { Size, debounce } from "lib";
import { GenericProps, WithoutE } from "../atoms/types";
import {
  SelectColor,
  IconTooltipButton,
  PlusCircleIcon,
  XCircleIcon,
} from "../atoms";
import { randomColor } from "../../logic/convert/random";

/**
 * value is an array of I_ColorAdapters
 * onChange gets an array of I_ColorAdapters and no event
 *
 * supports a variable length array and has buttons to add or remove colors
 * use prop isFixedCount={true} to disable this behavior
 *
 * pass through optional width and height
 *
 * what if value is empty?
 * can initiate with an empty array, which is fine assuming that isFixedCount is false
 * can initiate with an assigned count of random colors
 */
export type Props = Partial<Size> &
  WithoutE<GenericProps<ColorAdapter[]>> & {
    isFixedCount?: boolean;
  };

export const SelectMultipleColors = ({
  onChange: setColors,
  value: colors = [],
  isFixedCount = false,
  label = "Select Colors",
  width,
  height,
}: Props) => {
  const onAdd = () => {
    setColors([...colors, randomColor()]);
  };

  const onRemove = (i: number) => () => setColors(removeIndex(colors, i));

  const onChange = (i: number) =>
    debounce(
      (c) => {
        setColors(replaceIndex(colors, i, c));
      },
      250,
      { trailing: true }
    );

  return (
    <div>
      <Typography>{label}</Typography>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {colors.map((color, i) => (
          <div
            key={color.hex()}
            style={{
              display: "flex",
            }}
          >
            <Tooltip title="Pick Color" arrow>
              <SelectColor
                value={color}
                onChange={onChange(i)}
                width={width}
                height={height}
              />
            </Tooltip>
            {isFixedCount || (
              <IconTooltipButton
                title="Remove Color"
                icon={<XCircleIcon fontSize="small" />}
                onClick={onRemove(i)}
              />
            )}
          </div>
        ))}
        {isFixedCount || (
          <Button onClick={onAdd} endIcon={<PlusCircleIcon />}>
            Add Color
          </Button>
        )}
      </div>
    </div>
  );
};
