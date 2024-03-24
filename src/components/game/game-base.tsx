import { useGameStore } from "@store/useGame";
import React from "react";
import { WordContinue } from "./word-continue";
import { NumberGuest } from "./number-guest";

export function GameBase() {
  const { gameSelected } = useGameStore();

  return (
    <>
      {gameSelected === 1 && <WordContinue />}
      {gameSelected === 2 && <NumberGuest />}
    </>
  );
}
