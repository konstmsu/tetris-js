import { floor, max, min, range } from "lodash";
import { Cell, XY } from "./core";
import { Figure } from "./figure";
import { delay } from "./utils";

export class Field {
  data: Cell[][];
  fallingFigure: FallingFigure;

  constructor(size: { width: number; height: number }) {
    this.data = range(size.width).map((_y) =>
      range(size.height).map((_x) => " ")
    );
    this.fallingFigure = new FallingFigure(this);
  }

  get height(): number {
    return this.data.length;
  }

  get width(): number {
    return this.data[0]!.length;
  }

  readonly setCell = ({ y, x }: XY, value: Cell): void => {
    this.data[y]![x] = value;
  };

  readonly getCell = ({ x, y }: XY): Cell => {
    return this.data[y]?.[x] ?? "*";
  };

  readonly newFallingFigure = (): void => {
    const figure = Figure.O;
    this.fallingFigure.figure = figure;
    this.fallingFigure.rotation = 0;

    // Finding center...

    const figureDims = getFigureDimensions(this.fallingFigure);

    this.fallingFigure.offset = {
      x: floor((this.width - figureDims.width) / 2),
      y: this.height - figureDims.height,
    };
  };

  readonly mergeFallingFigure = (): void => {
    for (const block of this.fallingFigure.blocks) {
      this.setCell(block, "*");
    }
    this.fallingFigure.figure = undefined;
  };
}

// TODO Support rotation
const getFigureDimensions = (
  figure: FallingFigure
): { width: number; height: number } => {
  const blocks = [...figure.blocks];
  const xs = blocks.map((b) => b.x);
  const ys = blocks.map((b) => b.y);

  return { width: max(xs)! - min(xs)! + 1, height: max(ys)! - min(ys)! + 1 };
};

export class FallingFigure {
  field: Field;
  figure?: Figure;
  rotation = 0;
  offset = { x: 0, y: 0 };

  constructor(field: Field) {
    this.field = field;
  }

  get blocks(): XY[] {
    if (this.figure === undefined) return [];
    return this.figure.blocks.map(({ x, y }) => ({
      x: x + this.offset.x,
      y: y + this.offset.y,
    }));
  }

  tryMove(d: XY): boolean {
    console.log({ d, ...this });
    if (this.figure === undefined) throw Error("No figure");
    const { x, y } = this.offset;
    if (y === 0) return false;
    const desiredOffset = {
      x: x + d.x,
      y: y + d.y,
    };
    if (desiredOffset.x < 0) return false;

    const { width: targetWidth } = getFigureDimensions(this);
    if (desiredOffset.x > this.field.width - targetWidth) return false;

    this.offset = desiredOffset;
    return true;
  }
}

export class Game {
  field: Field;
  onFieldChanged: () => void;

  constructor(field: Field, onFieldChanged: () => void) {
    this.field = field;
    this.onFieldChanged = onFieldChanged;
    this.field.newFallingFigure();
  }

  startKeyboardProcessing = () => {
    const tryMove = (d: XY) => {
      if (this.field.fallingFigure.tryMove(d)) this.onFieldChanged();
    };

    document.addEventListener("keypress", (e) => {
      switch (e.code) {
        case "KeyA":
          tryMove({ x: -1, y: 0 });
          break;
        case "KeyD":
          tryMove({ x: 1, y: 0 });
          break;
        case "KeyS":
          tryMove({ x: 0, y: -1 });
          break;
      }
    });
  };

  startFalling = async () => {
    for (;;) {
      await delay(1000);
      if (!this.field.fallingFigure.tryMove({ x: 0, y: -1 })) {
        this.field.mergeFallingFigure();
        this.field.newFallingFigure();
      }
      this.onFieldChanged();
    }
  };

  start = () => {
    this.startFalling();
    this.startKeyboardProcessing();
    this.onFieldChanged();
  };
}
