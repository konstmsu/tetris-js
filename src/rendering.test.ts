import { Field } from "./game";
import { LineRenderer } from "./rendering";

describe("rendering", () => {
  test("as text", () => {
    const field = new Field({ size: { y: 5, x: 6 } });
    expect(new LineRenderer(field).renderWithBorders()).toStrictEqual([
      "--------",
      "|      |",
      "|      |",
      "|      |",
      "|      |",
      "|      |",
      "--------",
    ]);
  });
});
