import { range } from "lodash";
import { Field } from "./game";
import { LineRenderer } from "./rendering";

describe("field", () => {
  test("clear full lines", () => {
    const field = new Field({ size: { x: 2, y: 4 } });
    const renderer = new LineRenderer(field);

    const setLine = (y: number, line: string) => {
      for (const x of range(field.size.x)) {
        const c = line.charAt(x);
        if (c !== " " && c !== "*")
          throw new Error(`Unexpected character ${c}`);
        field.setCell({ x, y }, c);
      }
    };

    setLine(3, "**");
    setLine(2, " *");
    setLine(1, "**");
    setLine(0, "* ");

    field.clearFullLines();

    expect(renderer.renderWithoutBorders()).toStrictEqual([
      "  ",
      "  ",
      " *",
      "* ",
    ]);
  });
});
