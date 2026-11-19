import { createMMKV } from "react-native-mmkv";

import { env } from "@/lib/env";

export const storage = createMMKV({
  id: env.EXPO_PUBLIC_APP_ID,
});
