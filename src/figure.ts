import { max, min, some } from "lodash";
import { XY } from "./core";
import { Field } from "./game";

export class Figure {
  readonly blocks: ReadonlyArray<XY>;

  constructor(...baseViewLines: string[]) {
    this.blocks = baseViewLines
      .flatMap((line, y) => [...line].map((c, x) => ({ c, x, y })))
      .filter(({ c }) => c === "*")
      .map(({ x, y }) => ({ x, y }));
  }

  static T = new Figure("***", " *");
  static O = new Figure("**", "**");
  static S = new Figure("**", " **");
  static I = new Figure("****");
}

export interface Position {
  offset: XY;
  rotations: number;
}

export class PositionedFigure {
  readonly blocks: ReadonlyArray<XY>;
  readonly size: XY;

  constructor(
    public readonly figure: Figure,
    public readonly position: Position = {
      rotations: 0,
      offset: { x: 0, y: 0 },
    }
  ) {
    this.blocks = figure.blocks.map(({ x, y }) => ({
      x: x + this.position.offset.x,
      y: y + this.position.offset.y,
    }));

    const xs = this.blocks.map((b) => b.x);
    const ys = this.blocks.map((b) => b.y);

    this.size = { x: max(xs)! - min(xs)! + 1, y: max(ys)! - min(ys)! + 1 };
  }

  moved = (d: Position): PositionedFigure => {
    return new PositionedFigure(this.figure, {
      rotations: this.position.rotations + d.rotations,
      offset: {
        x: this.position.offset.x + d.offset.x,
        y: this.position.offset.y + d.offset.y,
      },
    });
  };

  isValid = (field: Field): boolean => {
    if (some(this.blocks, (p) => !field.isWithin(p))) return false;
    if (some(this.blocks, (p) => field.getCell(p) === "*")) return false;
    return true;
  };
}
