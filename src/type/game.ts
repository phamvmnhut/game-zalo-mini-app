import { Room } from "./room";

export type RoomGame = {
  id: number;
  room: Room;
  roomId: number;
  gameType: number;
  startTime: number;
  userIdList: string;
  createdAt: Date;
  updatedAt: Date;
  dataJson: JSON;
}
