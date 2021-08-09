import { range, repeat } from "lodash";
import { Field } from "./game";

export class LineRenderer {
  constructor(public readonly field: Field) {}

  private renderBody = (): string[][] => {
    const body = range(this.field.size.y).map((y) =>
      range(this.field.size.x).map((x) => <string>this.field.getCell({ x, y }))
    );

    for (const { x, y } of this.field.fallingFigure.figure?.blocks ?? []) {
      const line = body[y];
      if (line === undefined) throw new Error(`No line at ${y}`);
      line[x] = "#";
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
