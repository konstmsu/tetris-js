import { every, pullAt, range, times } from "lodash";
import { Cell, XY } from "./core";
import { FallingFigure } from "./figure";
import { delay } from "./utils";

export class Field {
  readonly size: XY;
  data: Cell[][];
  readonly fallingFigure: FallingFigure = new FallingFigure(this);

  constructor({ size }: { size: XY }) {
    this.size = size;
    this.data = times(size.y, () => this.createEmptyLine());
  }

  createEmptyLine = (): Cell[] => times(this.size.x, () => " ");

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
  isGameOver = false;
  onFieldChanged: () => void;

  constructor(field: Field, onFieldChanged: () => void) {
    this.field = field;
    this.onFieldChanged = onFieldChanged;
    this.field.fallingFigure.spawn();
  }

  startKeyboardProcessing = (): void => {
    const processInput = (e: KeyboardEvent): boolean => {
      const tryMove = this.field.fallingFigure.tryTransform;

      switch (e.code) {
        case "KeyA":
          return this.field.fallingFigure.tryMoveX(-1);
        case "KeyD":
          return this.field.fallingFigure.tryMoveX(1);
        case "KeyS":
          return tryMove({ rotations: 0, offset: { x: 0, y: -1 } });
        case "KeyW":
          return this.field.fallingFigure.tryRotateOnce();
      }

      return false;
    };

    document.addEventListener("keypress", (e) => {
      if (processInput(e)) this.onFieldChanged();
    });
  };

  startFalling = async (): Promise<void> => {
    while (!this.isGameOver) {
      await delay(1000);
      if (
        !this.field.fallingFigure.tryTransform({
          rotations: 0,
          offset: { x: 0, y: -1 },
        })
      ) {
        this.field.fallingFigure.merge();
        this.field.fallingFigure.spawn();
        if (this.field.fallingFigure.figure === undefined)
          this.isGameOver = true;
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
