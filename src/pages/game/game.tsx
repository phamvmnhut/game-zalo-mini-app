import React from "react";
import { useParams } from "react-router";
import { GameNotSelected } from "@components/game/game-not-selected";
import { GameBase } from "@components/game/game-base";
import { Page } from "zmp-ui";
import { Header } from "@components/layout/header";

export function Game() {
  const { id } = useParams();

  return (
    <Page className="flex flex-col">
      <Header />
      <GameNotSelected roomId={id} />
      <GameBase />
    </Page>
  );
}
