import { cn } from "../lib/utils";
import { gameStates, useGameStore } from "../store";

export const Menu = () => {
  const { gameState } = useGameStore.getState();
  const { startGame, goToMenu } = useGameStore();

  return (
    <>
      <div
        className={cn("menu", gameState !== gameStates.MENU && "smooth-hidden")}
      >
        <h1 className="text-2xl font-semibold text-center">Kana Game</h1>
        <button
          onClick={() => startGame({ mode: "hiragana" })}
          disabled={gameState !== gameStates.MENU}
        >
          Start hiragana game
        </button>
        <button
          onClick={() => startGame({ mode: "katakana" })}
          disabled={gameState !== gameStates.MENU}
        >
          Start katakana game
        </button>
      </div>

      <div
        className={cn(
          "scores",
          gameState !== gameStates.GAME_OVER && "smooth-hidden"
        )}
      >
        <h1 className="text-2xl font-semibold text-center">
          Congratulations you are becoming a true master!
        </h1>
        <button
          onClick={goToMenu}
          disabled={gameState !== gameStates.GAME_OVER}
        >
          Play again
        </button>
      </div>
    </>
  );
};
