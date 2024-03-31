import React from "react";

import { Page } from "zmp-ui";
import { Advertising } from "@components/home/advertising";
import { UserLogin } from "@components/home/user-login";
import { RoomList } from "@components/home/room-list";

export function HomePage() {
  return (
    <Page>
      <Advertising />
      <UserLogin />
      <RoomList />
    </Page>
  );
}
