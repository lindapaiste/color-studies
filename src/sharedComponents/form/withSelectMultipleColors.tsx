import React, { ComponentType, FunctionComponent, useState } from "react";
import { I_ColorAdapter, randomColor } from "../../packages/color-adapter";
import { SelectColor } from "./SelectColor";
import debounce from "lodash/debounce";
import { makeArray, removeIndex, replaceIndex } from "../../util";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import {Tooltip} from "../ui/Tooltip";

/**
 * works the same way as withSelectableColor, but for an array of colors instead of just one
 */
export const withSelectMultipleColors = <
  P extends { colors: I_ColorAdapter[] }
>(
  Component: ComponentType<P>,
  initialCount: number = 3,
  isFixedCount: boolean = false
): FunctionComponent<Omit<P, "colors">> => props => {
  const [colors, setColors] = useState(makeArray(initialCount, randomColor));

  const onAdd = () => {
    setColors([...colors, randomColor()]);
  };

  const onRemove = (i: number) => () => setColors(removeIndex(colors, i));

  const onChange = (i: number) =>
    debounce(
      c => {
        setColors(replaceIndex(colors, i, c));
      },
      250,
      { trailing: true }
    );

  return (
    <div>
      <div>
        <div>Select Colors:</div>
        <div
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          {colors.map((color, i) => (
            <div
              key={i}
              style={{
                display: "flex"
              }}
            >
              <Tooltip title="Pick Color">
                <SelectColor value={color} onChange={onChange(i)} />
              </Tooltip>
              {isFixedCount || (
                <Tooltip title="Remove Color">
                  <IconButton onClick={onRemove(i)}>
                    <HighlightOffIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          ))}
          {isFixedCount || (
            <Button onClick={onAdd} endIcon={<AddCircleOutlineIcon />}>
              Add Color
            </Button>
          )}
        </div>
      </div>
      <Component {...{ ...props, colors } as P} />
    </div>
  );
};
