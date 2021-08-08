import { Field } from "./game";
import { renderAsLines } from "./rendering";

describe("rendering", () => {
  test("as text", () => {
    const field = new Field({ size: { y: 6, x: 5 } });
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
