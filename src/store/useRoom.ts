import { BE_API } from "@config";
import { Room } from "@type/room";
import axios from "axios";
import { create } from "zustand";

type RoomState = {
  joinedRoom?: Room,
  roomList: Array<Room>
};

type RoomAction = {
  newRoom: (name: string, userId: number) => Promise<void>;
  fetchListRoom: () => Promise<void>
};

const defaultStore: RoomState = {
  joinedRoom: undefined,
  roomList: [],
};

const useRoomStore = create<RoomState & RoomAction>()((set, get) => ({
  ...defaultStore,
  newRoom: async (name: string, userId: number) => {
    const res = await axios.post(BE_API + "/room/", {
      name,
      userId,
    });
  },
  fetchListRoom: async () => {
    const res = await axios.get(BE_API + "/room");
    set({ roomList: res.data.data });
  }
}));

export { useRoomStore };
