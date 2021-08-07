import _ from "lodash";
import { XY } from "./core";
import { Figure, FigureOnField } from "./figure";
import { delay } from "./utils";

class Field {
  data: string[][];

  constructor(width: number, height: number) {
    this.data = _.range(height).map((_y) => _.range(width).map((_x) => " "));
  }

  get height() {
    return this.data.length;
  }

  get width() {
    return this.data[0]!.length;
  }

  setCell = ({ y, x }: XY, value: string) => {
    this.data[y]![x] = value;
  };
}

class Move {
  field: Field;
  rotatableFigure: FigureOnField;
  targetPosition: XY;

  constructor(
    field: Field,
    rotatableFigure: FigureOnField,
    targetPosition: XY
  ) {
    this.field = field;
    this.rotatableFigure = rotatableFigure;
    this.targetPosition = targetPosition;
  }

  get isPossible(): boolean {
    return true;
  }

  getFigureBlock = ({ x, y }: XY) => {
    return { x, y };
  };

  perform = () => {};
}

class MovableFigure {
  tryMoveX(_dx: number) {
    throw new Error("Method not implemented.");
  }

  figure: FigureOnField;
  position: XY;

  constructor(figure: FigureOnField, initialPosition: XY) {
    this.figure = figure;
    this.position = initialPosition;
  }

  createMove(_d: XY): Move {
    throw new Error("Method not implemented.2");
  }
}

class Game {
  field: Field;
  fallingFigure: MovableFigure;

  constructor(field: Field) {
    this.field = field;
    this.fallingFigure = this.createNextFallingFigure();
  }

  createNextFallingFigure(): MovableFigure {
    return new MovableFigure(new FigureOnField(Figure.O), {
      x: 1,
      y: 3,
    });
  }

  startKeyboardProcessing = () => {
    document.addEventListener("keypress", (e) => {
      switch (e.code) {
        case "A":
          this.fallingFigure.tryMoveX(-1);
          break;
        case "D":
          this.fallingFigure.tryMoveX(1);
          break;
      }
    });
  };

  startFalling = async () => {
    for (;;) {
      await delay(1000);
      const move = this.fallingFigure.createMove({ x: 0, y: -1 });
      if (move.isPossible) {
        move.perform();
      }
      this.drawField();
    }
  };

  drawField = () => {};

  start = () => {
    this.startFalling();
    this.startKeyboardProcessing();
  };
}

const main = async () => {
  const field = new Field(5, 6);
  field.setCell({ y: 1, x: 1 }, "*");
  field.setCell({ y: 1, x: 2 }, "*");

  const game = new Game(field);
  game.start();
};

main();
