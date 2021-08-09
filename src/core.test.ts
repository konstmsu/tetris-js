import { Figure } from "./figure";

describe("figure", () => {
  test("blocks", () => {
    expect(Figure.I.blocks).toStrictEqual([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
    ]);

    expect(Figure.S.blocks).toStrictEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ]);
  });
});
