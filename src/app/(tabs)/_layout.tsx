import { Redirect } from "expo-router";

import AppTabs from "@/components/app-tabs";
import { LoadingState } from "@/components/ui/loading-state";
import { useAuthStore } from "@/store/auth.store";

export default function TabsScreen() {
  const initialized = useAuthStore((s) => s.initialized);
  const session = useAuthStore((s) => s.session);

  if (!initialized) {
    return <LoadingState flex />;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return <AppTabs />;
}
