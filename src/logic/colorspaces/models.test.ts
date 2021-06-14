import { getModel, toModelAdapter, toModelName } from "./models";
import { ModelAdapter } from "./ModelAdapter";

describe("models", () => {
  it("can get a model instance by name", () => {
    const rgb = getModel("rgb");
    expect(rgb).toBeInstanceOf(ModelAdapter);
    expect(rgb.name).toBe("rgb");
  });

  it("can convert between strings and objects", () => {
    const name = "hsl";
    const model = getModel(name);
    expect(toModelName(model)).toBe(name);
    expect(toModelName(name)).toBe(name);
    // should be the same instance, so this is okay
    expect(toModelAdapter(model)).toBe(model);
    expect(toModelAdapter(name)).toBe(model);
  });
});
