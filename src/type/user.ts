export type User = {
  id: number;
  createdAt: Date;
  username: String;
}

export type UserWithToken = User & {
  token: string;
}
