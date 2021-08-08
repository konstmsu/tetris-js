import { XY } from "./core";

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

export class FigureOnField {
  figure: Figure;
  rotations: number;
  offset: XY;

  constructor(figure: Figure) {
    this.figure = figure;
    this.rotations = 0;
    this.offset = { x: 0, y: 0 };
  }

  get blocks(): Iterable<XY> {
    return [...this.figure.blocks];
  }
}
