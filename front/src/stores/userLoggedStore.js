import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useUserLoggedStore = create(
  persist(
    (set) => ({
      id: null,
      name: "",
      email: "",
      token: "",
      admin: false,
      guia: false,
      isLogged: false,
      guiaId: null,
      image: "",

      login: (user, token) => {
        localStorage.setItem("token", token);
        set(() => ({ ...user, token, isLogged: true }));
      },
      logout: () => {
        localStorage.removeItem("token");
        set(() => ({
          id: null,
          name: "",
          email: "",
          token: "",
          isLogged: false,
          admin: false,
          guia: false,
          guiaId: null,
          image: ""
        }));
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserLoggedStore;