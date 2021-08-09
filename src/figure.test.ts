import { Figure, PositionedFigure } from "./figure";
import { Field } from "./game";
import { LineRenderer } from "./rendering";

describe("figure", () => {
  test("rotation", () => {
    const renderRotation = (baseFigure: Figure, rotations: number) => {
      const figure = new PositionedFigure(baseFigure, {
        rotations,
        offset: { x: 0, y: 0 },
      });
      const field = new Field({ size: figure.size });
      field.fallingFigure.figure = figure;
      const renderer = new LineRenderer(field);
      return renderer.renderWithoutBorders().reverse();
    };

    expect(renderRotation(Figure.T, 0)).toStrictEqual([
      "***", //
      " * ",
    ]);
    expect(renderRotation(Figure.T, 1)).toStrictEqual([
      " *", //
      "**",
      " *",
    ]);
    expect(renderRotation(Figure.T, 2)).toStrictEqual([
      " * ", //
      "***",
    ]);
    expect(renderRotation(Figure.T, 3)).toStrictEqual([
      "* ", //
      "**",
      "* ",
    ]);

    expect(renderRotation(Figure.I, 0)).toStrictEqual([
      "*", //
      "*",
      "*",
      "*",
    ]);
    expect(renderRotation(Figure.I, 1)).toStrictEqual([
      "****", //
    ]);
    expect(renderRotation(Figure.I, 2)).toStrictEqual([
      "*", //
      "*",
      "*",
      "*",
    ]);
    expect(renderRotation(Figure.I, 3)).toStrictEqual([
      "****", //
    ]);

    expect(renderRotation(Figure.S, 0)).toStrictEqual([
      " **", //
      "** ",
    ]);
    expect(renderRotation(Figure.S, 1)).toStrictEqual([
      "* ", //
      "**",
      " *",
    ]);
    expect(renderRotation(Figure.S, 2)).toStrictEqual([
      " **", //
      "** ",
    ]);
    expect(renderRotation(Figure.S, 3)).toStrictEqual([
      "* ", //
      "**",
      " *",
    ]);

    expect(renderRotation(Figure.Z, 0)).toStrictEqual([
      "** ", //
      " **",
    ]);
    expect(renderRotation(Figure.Z, 1)).toStrictEqual([
      " *", //
      "**",
      "* ",
    ]);
    expect(renderRotation(Figure.Z, 2)).toStrictEqual([
      "** ", //
      " **",
    ]);
    expect(renderRotation(Figure.Z, 3)).toStrictEqual([
      " *", //
      "**",
      "* ",
    ]);

    expect(renderRotation(Figure.O, 0)).toStrictEqual([
      "**", //
      "**",
    ]);
    expect(renderRotation(Figure.O, 1)).toStrictEqual([
      "**", //
      "**",
    ]);
    expect(renderRotation(Figure.O, 2)).toStrictEqual([
      "**", //
      "**",
    ]);
    expect(renderRotation(Figure.O, 3)).toStrictEqual([
      "**", //
      "**",
    ]);
  });
});
