import { range, repeat } from "lodash";
import { Field } from "./game";

export const renderAsLines = (field: Field): string[] => {
  const body = range(field.height).map((y) =>
    range(field.width).map((x) => field.getCell({ x, y }))
  );
  for (const { x, y } of field.fallingFigure.blocks) {
    body[y]![x] = "*";
  }
  body.reverse();

  const result: string[] = [];

  result.push(repeat("-", field.width + 2));
  result.push(...body.map((line) => `|${line.join("")}|`));
  result.push(repeat("-", field.width + 2));

  return result;
};
