import { TupleClass } from "./TupleClass";
import { getModel } from "./models";
import { getChannel } from "./channels";

describe("TupleClass", () => {
  it("Can be used like an array", () => {
    const tuple = new TupleClass([0, 0.5, 1], getModel("rgb"), true);
    // destructuring
    const [r, g, b, ...rest] = tuple;
    expect(r).toBe(0);
    expect(g).toBe(0.5);
    expect(b).toBe(1);
    // indexed access
    expect(tuple[0]).toBe(0);
    expect(tuple[1]).toBe(0.5);
    expect(tuple[2]).toBe(1);
    // length
    expect(tuple.length).toBe(3);
    expect(rest).toHaveLength(0);
  });

  it("Can map its values", () => {
    const tuple = new TupleClass([0, 0.5, 1], getModel("rgb"), true);
    const mapped = tuple.map((v) => 0.5 * v);
    expect(mapped).toBeInstanceOf(TupleClass);
    expect(mapped.isNormalized).toBe(true);
    const [r, g, b] = mapped;
    expect(r).toBe(0);
    expect(g).toBe(0.25);
    expect(b).toBe(0.5);
  });

  it("Can switch between normalized and non-normalized versions", () => {
    const normalized = new TupleClass([1, 1, 1], getModel("hsl"), true);
    const raw = new TupleClass([360, 100, 100], getModel("hsl"), false);
    const expectNormal = (tuple: TupleClass) => {
      expect(tuple.isNormalized).toBe(true);
      expect(tuple.values).toEqual([1, 1, 1]);
    };
    const expectRaw = (tuple: TupleClass) => {
      expect(tuple.isNormalized).toBe(false);
      expect(tuple.values).toEqual([360, 100, 100]);
    };
    expectNormal(normalized.normalize());
    expectRaw(normalized.deNormalize());
    expectNormal(normalized.to(true));
    expectRaw(normalized.to(false));

    expectNormal(raw.normalize());
    expectRaw(raw.deNormalize());
    expectNormal(raw.to(true));
    expectRaw(raw.to(false));
  });

  it("Can replace values", () => {
    const initial = new TupleClass([1, 1, 1], getModel("hsl"), true);
    expect(initial.replace(0, 0).values).toEqual([0, 1, 1]);
    expect(initial.replace("hsl.s", 0).values).toEqual([1, 0, 1]);
    expect(initial.replace(getChannel("hsl.l"), 0).values).toEqual([1, 1, 0]);
    expect(initial.replace(0, (v) => v - 0.1).values).toEqual([0.9, 1, 1]);
  });
});
