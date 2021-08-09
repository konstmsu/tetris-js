import { every, pullAt, range } from "lodash";
import { Cell, XY } from "./core";
import { FallingFigure, Position } from "./figure";
import { delay } from "./utils";

export class Field {
  readonly size: XY;
  data: Cell[][];
  fallingFigure: FallingFigure;

  constructor({ size }: { size: XY }) {
    this.size = size;
    this.data = range(size.y).map(() => this.createEmptyLine());
    this.fallingFigure = new FallingFigure(this);
  }

  createEmptyLine = (): Cell[] => range(this.size.x).map(() => " ");

  isWithin = ({ x, y }: XY): boolean => {
    if (x < 0) return false;
    if (y < 0) return false;
    if (x >= this.size.x) return false;
    if (y >= this.size.y) return false;
    return true;
  };

  readonly setCell = ({ y, x }: XY, value: Cell): void => {
    const line = this.data[y];
    if (line === undefined) throw new Error(`No line at ${y}`);
    line[x] = value;
  };

  readonly getCell = ({ x, y }: XY): Cell => {
    return this.data[y]?.[x] ?? "*";
  };

  clearFullLines = (): void => {
    // TODO refactor
    const fullLineIndexes = range(this.size.y)
      .map((y) => ({
        y,
        isFull: every(
          range(this.size.x),
          (x) => this.getCell({ x, y }) === "*"
        ),
      }))
      .filter(({ isFull }) => isFull)
      .map(({ y }) => y);

    pullAt(this.data, fullLineIndexes);
    const newData = [
      ...this.data,
      ...fullLineIndexes.map(this.createEmptyLine),
    ];
    this.data = newData;
  };
}

export class Game {
  field: Field;
  onFieldChanged: () => void;

  constructor(field: Field, onFieldChanged: () => void) {
    this.field = field;
    this.onFieldChanged = onFieldChanged;
    this.field.fallingFigure.spawn();
  }

  startKeyboardProcessing = (): void => {
    const tryMove = (d: Position) => {
      if (this.field.fallingFigure.tryTransform(d)) this.onFieldChanged();
    };

    document.addEventListener("keypress", (e) => {
      switch (e.code) {
        case "KeyA":
          tryMove({ rotations: 0, offset: { x: -1, y: 0 } });
          break;
        case "KeyD":
          tryMove({ rotations: 0, offset: { x: 1, y: 0 } });
          break;
        case "KeyS":
          tryMove({ rotations: 0, offset: { x: 0, y: -1 } });
          break;
        case "KeyW":
          tryMove({ rotations: 1, offset: { x: 0, y: 0 } });
          break;
      }
    });
  };

  startFalling = async (): Promise<void> => {
    for (;;) {
      await delay(1000);
      if (
        !this.field.fallingFigure.tryTransform({
          rotations: 0,
          offset: { x: 0, y: -1 },
        })
      ) {
        this.field.fallingFigure.merge();
        this.field.fallingFigure.spawn();
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
