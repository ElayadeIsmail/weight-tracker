import { createJSONStorage } from "zustand/middleware";
import { storage } from "./index";

export const zustandStorage = createJSONStorage(() => ({
  getItem: (key) => storage.getString(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.remove(key),
}));
