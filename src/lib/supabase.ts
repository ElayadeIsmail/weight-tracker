import { createClient } from "@supabase/supabase-js";

import { env } from "./env";
import { storage } from "./storage";

const ExpoStorage = {
  getItem(key: string) {
    return storage.getString(key) ?? null;
  },
  setItem(key: string, value: string) {
    storage.set(key, value);
  },
  removeItem(key: string) {
    storage.remove(key);
  },
};

const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_PROJECT_URL;
const supabasePublishableKey = env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: ExpoStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
