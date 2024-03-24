import { BE_API } from "@config";
import { Room, RoomUser } from "@type/room";
import axios from "axios";
import { create } from "zustand";

type GameState = {
  roomGameId?: number,
  gameSelected?: number,
  currentTurn?: number;
  currentValue?: string;
  nextTurn?: string;
  endTurnTime?: number;
  currentRound?: number;
  history: Array<{
    userId: number;
    value: string;
    time: number;
    guestFor: number;
  }>;
  userList: Array<RoomUser>;
  winner?: RoomUser;
  numberGuest: Array<string>;
};

type GameAction = {
  playGame: (data: any) => void;
  updateRound: (data: any) => void;
  resetGame: VoidFunction;
  updateWinner: (data: any) => void;
};

const defaultStore: GameState = {
  roomGameId: undefined,
  gameSelected: undefined,
  currentTurn: undefined,
  currentValue: undefined,
  nextTurn: undefined,
  endTurnTime: undefined,
  currentRound: undefined,
  history: [],
  userList: [],
  winner: undefined,
  numberGuest: [],
};

const useGameStore = create<GameState & GameAction>()((set, get) => ({
  ...defaultStore,
  playGame: (data: any) => {
    set({
      roomGameId: parseInt(data.id, 10),
      gameSelected: data.gameType,
      userList: data.userList,

      currentTurn: data.dataJson.currentTurn,
      currentValue: data.dataJson.currentValue,
      nextTurn: data.dataJson.nextTurn,
      endTurnTime: data.dataJson.endTurnTime,
      currentRound: data.dataJson.currentRound,
      history: data.dataJson.history,
      numberGuest: data.dataJson.numberGuest,
    })
  },
  updateRound: (data: any) => {
    set({
      currentTurn: data.dataJson.currentTurn,
      currentValue: data.dataJson.currentValue,
      nextTurn: data.dataJson.nextTurn,
      endTurnTime: data.dataJson.endTurnTime,
      currentRound: data.dataJson.currentRound,
      history: data.dataJson.history,
      numberGuest: data.dataJson.numberGuest,
    })
  },
  resetGame: () => {
    set({
      ...defaultStore
    })
  },
  updateWinner: (data: any) => {
    set({
      winner: get().userList.find((e) => e.id == data.id)
    })
  }
}));

export { useGameStore };
