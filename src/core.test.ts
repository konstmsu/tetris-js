import { Figure } from "./figure";

describe("figure", () => {
  test("blocks", () => {
    expect(Figure.I.blocks).toStrictEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ]);

    expect(Figure.S.blocks).toStrictEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ]);
  });
});
