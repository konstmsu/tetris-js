import { Field } from "./game";
import { renderAsLines } from "./rendering";

describe("rendering", () => {
  test("as text", () => {
    const field = new Field(6, 5);
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
