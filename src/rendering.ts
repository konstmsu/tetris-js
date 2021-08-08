import { range, repeat } from "lodash";
import { Field } from "./game";

export const renderAsLines = (field: Field): string[] => {
  const body = range(field.size.y).map((y) =>
    range(field.size.x).map((x) => field.getCell({ x, y }))
  );
  for (const { x, y } of field.fallingFigure.figure?.blocks ?? []) {
    body[y]![x] = "*";
  }
  body.reverse();

  const result: string[] = [];

  result.push(repeat("-", field.size.x + 2));
  result.push(...body.map((line) => `|${line.join("")}|`));
  result.push(repeat("-", field.size.x + 2));

  return result;
};
