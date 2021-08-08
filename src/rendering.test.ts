import { Field } from "./game";
import { renderAsLines } from "./rendering";

describe("rendering", () => {
  test("as text", () => {
    const field = new Field({ height: 6, width: 5 });
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
