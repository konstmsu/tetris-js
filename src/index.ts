import { Field, Game } from "./game";
import { LineRenderer } from "./rendering";

const main = async () => {
  const field = new Field({ size: { x: 8, y: 10 } });
  const renderer = new LineRenderer(field);

  const game = new Game(field, () => {
    const fieldElement = document.getElementById("field");
    if (fieldElement === null) throw new Error(`Could not find field element`);
    const result = renderer.renderWithBorders();

    if (game.field.isGameOver)
      result.push("Game Over", "Refresh page to restart");

    fieldElement.textContent = result.join("\n");
  });
  game.start();
};

main();
