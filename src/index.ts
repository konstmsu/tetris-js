import { Field, Game } from "./game";
import { renderAsLines } from "./rendering";

const main = async () => {
  const field = new Field({ size: { x: 4, y: 8 } });

  const game = new Game(field, () => {
    const fieldElement = document.getElementById("field");
    if (fieldElement === null) throw new Error(`Could not find field element`);
    fieldElement.textContent = renderAsLines(field).join("\n");
  });
  game.start();
};

main();
