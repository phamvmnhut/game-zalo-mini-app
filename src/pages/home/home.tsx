import React from "react";

import { PageLayout } from "@components/layout/page";
import { Advertising } from "@components/home/advertising";
import { UserLogin } from "@components/home/user-login";
import { RoomList } from "@components/home/room-list";

export function HomePage() {
  return (
    <PageLayout hiddenBackIcon={true}>
      <Advertising />
      <UserLogin />
      <RoomList />
    </PageLayout>
  );
}
