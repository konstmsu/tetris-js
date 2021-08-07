import _ from "lodash";
import { Field, Game } from "./game";
import { renderAsLines } from "./rendering";

const main = async () => {
  const field = new Field(5, 6);

  const game = new Game(field, () => {
    const fieldElement = document.getElementById("field");
    fieldElement!.textContent = renderAsLines(field).join("\n");
  });
  game.start();
};

main();
