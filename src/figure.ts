import { some } from "lodash";
import { XY } from "./core";
import { Field } from "./game";
import { getSize } from "./utils";

export class Figure {
  readonly blocks: ReadonlyArray<XY>;
  readonly size: XY;

  constructor(...baseViewLines: string[]) {
    baseViewLines.reverse();
    this.blocks = baseViewLines
      .flatMap((line, y) => [...line].map((c, x) => ({ c, x, y })))
      .filter(({ c }) => c === "*")
      .map(({ x, y }) => ({ x, y }));
    this.size = getSize(this.blocks);
  }

  static T = new Figure(
    "***", //
    " *"
  );
  static O = new Figure(
    "**", //
    "**"
  );
  static S = new Figure(
    " **", //
    "**"
  );
  static Z = new Figure(
    "**", //
    " **"
  );
  static I = new Figure(
    "*", //
    "*",
    "*",
    "*"
  );
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
    const applyRotation = ({ x, y }: XY): XY => {
      switch (this.position.rotations) {
        case 0:
          return { x, y };
        case 1:
          return { x: y, y: figure.size.x - x };
      }
      throw new Error("Unsupported rotation");
    };
    const applyOffset = ({ x, y }: XY): XY => {
      return {
        x: x + this.position.offset.x,
        y: y + this.position.offset.y,
      };
    };
    this.blocks = figure.blocks.map(applyRotation).map(applyOffset);
    this.size = getSize(this.blocks);
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
