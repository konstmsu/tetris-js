import { max, min } from "lodash";
import { XY } from "./core";

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getSize = (blocks: ReadonlyArray<XY>): XY => {
  const xs = blocks.map((b) => b.x);
  const ys = blocks.map((b) => b.y);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { x: max(xs)! - min(xs)! + 1, y: max(ys)! - min(ys)! + 1 };
};
