import { PageLayout } from "@components/layout/page";
import React from "react";
import { useParams } from "react-router";
import { GameNotSelected } from "@components/game/game-not-selected";
import { GameBase } from "@components/game/game-base";

export function Game() {
  const { id } = useParams();

  return (
    <PageLayout>
      <GameNotSelected roomId={id} />
      <GameBase />
    </PageLayout>
  );
}
