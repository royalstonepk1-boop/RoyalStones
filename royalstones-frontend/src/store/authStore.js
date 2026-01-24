import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { updateProfile,getUsers } from "../api/auth.api";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      allUsers:[],

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      updateUser: async (updates) => {
        try {
          //console.log(updates);
          const resp = await updateProfile(updates); // Send only updates
          if (resp) {
            set({ user: resp.data });
          }
        } catch (error) {
          console.error('Update failed:', error);
        }
      },
      getAllUsers: async () => {
        try {
          const resp = await getUsers();
          if (resp) {
            set({ allUsers: resp.data });
          }
        } catch (error) {
          console.error('Update failed:', error);
        }
      },

      logout: () => {
        set({ user: null, token: null });
        sessionStorage.removeItem("auth-storage");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
