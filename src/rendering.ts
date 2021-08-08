import { range, repeat } from "lodash";
import { Cell } from "./core";
import { Field } from "./game";

export class LineRenderer {
  constructor(public readonly field: Field) {}

  private renderBody = (): Cell[][] => {
    const body = range(this.field.size.y).map((y) =>
      range(this.field.size.x).map((x) => this.field.getCell({ x, y }))
    );

    for (const { x, y } of this.field.fallingFigure.figure?.blocks ?? []) {
      body[y]![x] = "*";
    }

    body.reverse();

    return body;
  };

  renderWithoutBorders = (): string[] =>
    this.renderBody().map((line) => line.join(""));

  renderWithBorders = (): string[] => {
    const body = this.renderBody();

    const result: string[] = [];

    result.push(repeat("-", this.field.size.x + 2));
    result.push(...body.map((line) => `|${line.join("")}|`));
    result.push(repeat("-", this.field.size.x + 2));

    return result;
  };
}
