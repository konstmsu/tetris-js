import { floor, max, min, range, sample, some } from "lodash";
import { XY } from "./core";
import { Field } from "./game";

export class Figure {
  readonly size: XY;

  constructor(public readonly blocks: ReadonlyArray<XY>) {
    const xs = blocks.map((b) => b.x);
    const ys = blocks.map((b) => b.y);

    const minX = min(xs);
    if (minX !== 0) throw new Error(`minX should be 0, got ${minX}`);

    const minY = min(ys);
    if (minY !== 0) throw new Error(`minY should be 0, got ${minY}`);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.size = { x: max(xs)! + 1, y: max(ys)! + 1 };
  }

  static fromLines = (...baseViewLines: string[]): Figure => {
    const blocks = baseViewLines
      .reverse()
      .flatMap((line, y) => [...line].map((c, x) => ({ c, x, y })))
      .filter(({ c }) => c === "*")
      .map(({ x, y }) => ({ x, y }));

    return new Figure(blocks);
  };

  rotated = (): Figure =>
    new Figure(
      this.blocks.map(({ x, y }) => ({ x: y, y: this.size.x - x - 1 }))
    );

  static T = Figure.fromLines(
    "***", //
    " *"
  );
  static O = Figure.fromLines(
    "**", //
    "**"
  );
  static S = Figure.fromLines(
    " **", //
    "**"
  );
  static Z = Figure.fromLines(
    "**", //
    " **"
  );
  static I = Figure.fromLines(
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
  readonly rotatedFigure: Figure;

  constructor(
    public readonly figure: Figure,
    public readonly position: Position = {
      rotations: 0,
      offset: { x: 0, y: 0 },
    }
  ) {
    this.rotatedFigure = range(position.rotations).reduce(
      (f) => f.rotated(),
      figure
    );
    this.blocks = this.rotatedFigure.blocks.map(({ x, y }) => ({
      x: x + this.position.offset.x,
      y: y + this.position.offset.y,
    }));
  }

  get size(): XY {
    return this.rotatedFigure.size;
  }

  transformed = (d: Position): PositionedFigure => {
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
    if (some(this.blocks, (p) => field.getCell(p) !== " ")) return false;
    return true;
  };
}

export class FallingFigure {
  private _figure?: PositionedFigure;

  constructor(readonly field: Field) {}

  get figure(): PositionedFigure | undefined {
    return this._figure;
  }

  set figure(value: PositionedFigure | undefined) {
    if (value !== undefined && !value.isValid(this.field))
      throw new Error(`Figure must be valid`);
    this._figure = value;
  }

  tryRotateOnce(): boolean {
    for (const x of [0, -1, -2, -3])
      if (this.tryTransform({ offset: { x, y: 0 }, rotations: 1 })) return true;

    return false;
  }

  // TODO make private
  tryTransform(d: Position): boolean {
    if (this.figure === undefined) throw Error("No figure");
    const desired = this.figure.transformed(d);
    if (!desired.isValid(this.field)) return false;
    this.figure = desired;
    return true;
  }

  readonly spawn = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const figure = sample([Figure.I, Figure.O, Figure.S, Figure.T, Figure.Z])!;
    const measuredFigure = new PositionedFigure(figure);
    const desiredFigure = new PositionedFigure(measuredFigure.figure, {
      rotations: 0,
      offset: {
        x: floor((this.field.size.x - measuredFigure.size.x) / 2),
        y: this.field.size.y - measuredFigure.size.y,
      },
    });

    if (desiredFigure.isValid(this.field)) this.figure = desiredFigure;
  };

  readonly merge = (): void => {
    if (this.figure === undefined) throw new Error("No falling figure");

    for (const block of this.figure.blocks) {
      this.field.setCell(block, "*");
    }

    this.figure = undefined;

    this.field.clearFullLines();
  };
}
