import { STORAGE_KEYS } from "@/constants/storage";
import { ThemePreference } from "@/types/profile";
import { persist } from "zustand/middleware";
import { create } from "zustand";
import { zustandStorage } from "@/lib/storage/zustand";

type ThemeState = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: "system",
      setPreference: (preference) => set({ preference }),
    }),
    {
      name: STORAGE_KEYS.themePreference,
      storage: zustandStorage,
    },
  ),
);
