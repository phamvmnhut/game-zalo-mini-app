import { BE_API } from "@config";
import { Room } from "@type/room";
import axios from "axios";
import { create } from "zustand";

type GameState = {
  roomGameId?: number,
  gameSelected?: number,
  currentTurn?: string;
  currentValue?: string;
  nextTurn?: string;
  endTurnTime?: number;
  history: [];
};

type GameAction = {
  selectGame: (data: any) => void;
};

const defaultStore: GameState = {
  roomGameId: undefined,
  gameSelected: undefined,
  currentTurn: undefined,
  currentValue: undefined,
  nextTurn: undefined,
  endTurnTime: undefined,
  history: []
};

const useGameStore = create<GameState & GameAction>()((set, get) => ({
  ...defaultStore,
  selectGame: (data: any) => {
    set({
      roomGameId: parseInt(data.id, 10),
      gameSelected: data.gameType,
      currentTurn: data.dataJson.currentTurn,
      currentValue: data.dataJson.currentValue,
      nextTurn: data.dataJson.nextTurn,
      endTurnTime: data.dataJson.endTurnTime,
      history: [],
    })
  }
}));

export { useGameStore };
