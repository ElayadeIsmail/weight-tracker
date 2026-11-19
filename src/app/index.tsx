import { Redirect } from "expo-router";

import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Screen } from "@/components/ui/screen";
import { useProfile } from "@/hooks/use-profile";
import { useAuthStore } from "@/store/auth.store";

export default function Index() {
  const initialized = useAuthStore((s) => s.initialized);
  const session = useAuthStore((s) => s.session);
  const { data, isPending, isError, error, refetch } = useProfile();

  if (!initialized) {
    return <LoadingState flex />;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  if (isPending) {
    return <LoadingState flex />;
  }

  if (isError) {
    return (
      <Screen>
        <ErrorState error={error} onRetry={refetch} flex />
      </Screen>
    );
  }

  if (!data?.onboarding_completed) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)/today" />;
}
