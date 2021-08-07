import { floor, max, min, range } from "lodash";
import { Cell, XY } from "./core";
import { Figure } from "./figure";
import { delay } from "./utils";

export class Field {
  data: Cell[][];
  fallingFigure: FallingFigure;

  constructor(width: number, height: number) {
    this.data = range(height).map((_y) => range(width).map((_x) => " "));
    this.fallingFigure = new FallingFigure();
  }

  get height() {
    return this.data.length;
  }

  get width() {
    return this.data[0]!.length;
  }

  readonly setCell = ({ y, x }: XY, value: Cell) => {
    this.data[y]![x] = value;
  };

  readonly getCell = ({ x, y }: XY): Cell => {
    return this.data[y]?.[x] ?? "*";
  };

  readonly newFallingFigure = () => {
    const figure = Figure.O;
    this.fallingFigure.figure = figure;
    this.fallingFigure.rotation = 0;

    // Finding center...
    const blocks = [...this.fallingFigure.blocks];
    const xs = blocks.map((b) => b.x);
    const ys = blocks.map((b) => b.y);

    const figureWidth = max(xs)! - min(xs)! + 1;
    const figureHeight = max(ys)! - min(ys)! + 1;

    this.fallingFigure.offset = {
      x: floor((this.width - figureWidth) / 2),
      y: this.height - figureHeight,
    };
  };

  readonly mergeFallingFigure = () => {
    for (const block of this.fallingFigure.blocks) {
      this.setCell(block, "*");
    }
    this.fallingFigure.figure = undefined;
  };
}

export class FallingFigure {
  figure?: Figure;
  rotation: number = 0;
  offset: XY = { x: 0, y: 0 };

  get blocks(): Iterable<XY> {
    if (this.figure === undefined) throw new Error("no figure");
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
    this.offset = { x: x + d.x, y: y + d.y };
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
        case "A":
          tryMove({ x: -1, y: 0 });
          break;
        case "D":
          tryMove({ x: 1, y: 0 });
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
