import { Field, Game } from "./game";
import { LineRenderer } from "./rendering";

const main = async () => {
  const field = new Field({ size: { x: 8, y: 10 } });
  const renderer = new LineRenderer(field);

  const game = new Game(field, () => {
    const fieldElement = document.getElementById("field");
    if (fieldElement === null) throw new Error(`Could not find field element`);
    fieldElement.textContent = game.field.isGameOver
      ? "Game Over\nRefresh page to restart"
      : renderer.renderWithBorders().join("\n");
  });
  game.start();
};

main();
