import { BE_API } from "@config";
import { Room } from "@type/room";
import axios from "axios";
import { create } from "zustand";

type RoomState = {
  joinedRoom?: Room,
  loading: boolean,
  roomList: Array<Room>
};

type RoomAction = {
  newRoom: (name: string, userId: number) => Promise<void>;
  fetchListRoom: () => Promise<void>
};

const defaultStore: RoomState = {
  joinedRoom: undefined,
  loading: true,
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
    set({ loading: true });
    const res = await axios.get(BE_API + "/room");
    set({ roomList: res.data.data.result, loading: false });
  }
}));

export { useRoomStore };
