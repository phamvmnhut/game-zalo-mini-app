import React, { useEffect } from "react";
import { ReactNode } from "react";

import { useUserStore } from "@store/useUser";

export function AuthenticateProvider({ children }: { children: ReactNode }) {
  const { reLogin } = useUserStore();

  useEffect(() => {
    reLogin();
  }, []);

  return <>{children}</>;
}
