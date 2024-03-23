import { BE_API } from "@config";
import { UserWithToken } from "@type/user";
import axios from "axios";
import { create } from "zustand";

type UserState = {
  user?: UserWithToken,
  loading: boolean,
};

type UserAction = {
  login: (username: string) => Promise<void>;
  reLogin: () => Promise<void>;
  logout: () => Promise<void>;
};

const defaultStore: UserState = {
  user: undefined,
  loading: true,
};

const useUserStore = create<UserState & UserAction>()((set, get) => ({
  ...defaultStore,
  login: async (username: string) => {
    const res = await axios.post(BE_API + "/user/get-or-create", {
      username,
    });
    set({
      user: res.data.data,
      loading: false,
    });
    localStorage.setItem("user", JSON.stringify({
      ...res.data.data,
      token: "",
    }))
  },
  reLogin: async () => {
    let userData = undefined;
    const value = localStorage.getItem("user");
    if (value) {
      userData = JSON.parse(value);
    };

    set({
      user: userData,
      loading: false,
    })
  },
  logout: async () => {
    localStorage.removeItem("user");
    set({
      ...defaultStore,
      loading: false,
    })
  }
}));

export { useUserStore };
