import { Field } from "./game";
import { renderAsLines } from "./rendering";

describe("rendering", () => {
  test("as text", () => {
    const field = new Field({ size: { y: 5, x: 6 } });
    expect(renderAsLines(field)).toStrictEqual([
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
