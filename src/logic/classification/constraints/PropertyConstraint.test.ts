import { PropertyConstraint } from "./PropertyConstraint";
import { ColorAdapter } from "../../convert";

describe("PropertyConstraint", () => {
  const constraint = new PropertyConstraint({
    channel: "hsl.h",
    min: 90,
    max: 180,
  });

  it("can be constructed, normalizes min and max", () => {
    expect(constraint.min).toEqual(0.25);
    expect(constraint.max).toEqual(0.5);
  });

  it("can check a color", () => {
    const color = (hue: number) => ColorAdapter.staticFrom([hue, 0, 0], "hsl");
    expect(constraint.getMatchError(color(0))).not.toBeUndefined();
    expect(constraint.getMatchError(color(89.99999), 0.01)).toBeUndefined();
    expect(constraint.getMatchError(color(90))).toBeUndefined();
    expect(constraint.getMatchError(color(190))).not.toBeUndefined();
  });
});
