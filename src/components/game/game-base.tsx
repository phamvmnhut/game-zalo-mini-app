import { WordContinue } from "@components/game/word-continue";
import { useGameStore } from "@store/useGame";
import React from "react";

export function GameBase() {
  const { gameSelected } = useGameStore();
  
  return <>{gameSelected === 1 && <WordContinue />}</>;
}
