"use strict";

class Field {
  constructor(width, height) {
    this.data = [];

    for (const y of _.range(height)) {
      const line = _.range(width).map((_) => " ");
      this.data.push(line);
    }
  }

  get height() {
    return this.data.length;
  }

  get width() {
    return this.data[0].length;
  }

  setCell = ({ y, x }, value) => {
    this.data[y][x] = value;
  };
}

class FigureTemplate {
  constructor(baseView) {
    this.baseViewLines = baseView.split("\n");
  }

  *blocks() {
    let y = 0;
    for (const line of this.baseViewLines) {
      let x = 0;
      for (const c of line) {
        if (c === "*") yield { x, y };
        x += 1;
      }
      y += 1;
    }
  }
}
FigureTemplate.T = new FigureTemplate("***\n *");
FigureTemplate.O = new FigureTemplate("**\n**");
FigureTemplate.S = new FigureTemplate("**\n **");
FigureTemplate.I = new FigureTemplate("****");

class RotatableFigure {
  constructor(figureTemplate) {
    this.figureTemplate = figureTemplate;
    this.rotations = 0;
  }

  applyRotation = ({ x, y }) => {};

  *blocks() {
    return this.figureTemplate.block().map(applyRotation);
  }
}

class Move {
  constructor({ field, rotatableFigure, targetPosition }) {
    this.field = field;
    this.rotatableFigure = rotatableFigure;
    this.targetPosition = targetPosition;
  }

  get isPossible() {}

  getFigureBlock = ({ x, y }) => {};

  perform = () => {};
}

class MovableFigure {
  constructor(figure, initialPosition) {
    this.figure = figure;
    this.position = initialPosition;
  }

  createMove() {}
}

class Game {
  constructor(field) {
    this.field = field;
    this.fallingFigure = new Figure();
  }

  processKey = (e) => {
    switch (e.code) {
      case "A":
        this.fallingFigure.tryMoveX(-1);
        break;
      case "D":
        this.fallingFigure.tryMoveX(1);
        break;
    }
  };

  startKeyboardProcessing = () => {
    document.addEventListener("keypress", (e) => {
      this.processKey(e);
    });
  };

  startFalling = async () => {
    for (;;) {
      await Promise.delay(1000);
      const move = this.fallingFigure.createMove({ dx: 0, dy: -1 });
      if (move.isPossible()) {
        move.perform();
      }
    }
  };

  start = () => {
    startFalling();
  };
}

const main = async () => {
  const fieldElement = document.getElementById("field");

  const field = new Field(5, 6);
  field.setCell({ y: 1, x: 1 }, "*");
  field.setCell({ y: 1, x: 2 }, "*");

  for (;;) {
    await Promise.delay(500);
    fieldElement.textContent = new Date() + "\n" + field.render(6, 10);
    field.textContent += new Date();
  }
};

main();
