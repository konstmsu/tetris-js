import { every, floor, max, min, pullAt, range, some } from "lodash";
import { Cell, XY } from "./core";
import { Figure } from "./figure";
import { delay } from "./utils";

export class Field {
  size: XY;
  data: Cell[][];
  fallingFigure: FallingFigure;

  constructor({ size }: { size: XY }) {
    this.size = size;
    this.data = range(size.y).map(() => this.createEmptyLine());
    this.fallingFigure = new FallingFigure(this);
  }

  createEmptyLine = (): Cell[] => range(this.size.x).map(() => " ");

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

    const fullLineIndexes = range(this.height)
      .map((y) => ({
        y,
        isFull: every(range(this.width), (x) => this.getCell({ x, y }) === "*"),
      }))
      .filter(({ isFull }) => isFull)
      .map(({ y }) => y);

    console.log(`Removing`, fullLineIndexes);
    pullAt(this.data, fullLineIndexes);
    const newData = [
      ...this.data,
      ...fullLineIndexes.map(this.createEmptyLine),
    ];
    this.data = newData;
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

  private getBlocksAt(offset: XY) {
    if (this.figure === undefined) return [];
    return this.figure.blocks.map(({ x, y }) => ({
      x: x + offset.x,
      y: y + offset.y,
    }));
  }

  get blocks(): XY[] {
    return this.getBlocksAt(this.offset);
  }

  isValidPosition = (offset: XY): boolean => {
    const blocks = this.getBlocksAt(offset);
    if (some(blocks, (p) => this.field.getCell(p) === "*")) return false;
    return true;
  };

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

    if (!this.isValidPosition(desiredOffset)) return false;

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

  startKeyboardProcessing = (): void => {
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

  startFalling = async (): Promise<void> => {
    for (;;) {
      await delay(1000);
      if (!this.field.fallingFigure.tryMove({ x: 0, y: -1 })) {
        this.field.mergeFallingFigure();
        this.field.newFallingFigure();
      }
      this.onFieldChanged();
    }
  };

  start = (): void => {
    this.startFalling();
    this.startKeyboardProcessing();
    this.onFieldChanged();
  };
}
