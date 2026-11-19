import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

type AuthState = {
  session: Session | null;
  user: User | null;
  initialized: boolean;
  signout(): void;
  setSession(session: Session | null): void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  initialized: false,

  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      initialized: true,
    }),

  signout: () =>
    set({
      session: null,
      user: null,
      initialized: true,
    }),
}));
