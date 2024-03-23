import { RoomGame } from "./game";
import { User } from "./user";

export type Room = {
  id: string;
  name: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  RoomUser: Array<RoomUser>;
  RoomGame: Array<RoomGame>;
};

export type RoomUser = {
  id: number;
  user: User;
  userId: number;
  role: number;
}
