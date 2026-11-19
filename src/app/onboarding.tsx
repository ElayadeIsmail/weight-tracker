import { Redirect, router } from "expo-router";

import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { LoadingState, Screen, Text } from "@/components/ui";
import { useCompleteOnboarding, useProfile } from "@/hooks/use-profile";
import { useSaveWeight } from "@/hooks/use-weight";
import { toDateKey } from "@/utils/date";

export default function OnboardingScreen() {
  const { data: profile, isLoading, isError, error } = useProfile();

  const { mutateAsync: saveWeight } = useSaveWeight();
  const { complete } = useCompleteOnboarding();

  if (isLoading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <Text>{error?.message ?? "Something went wrong."}</Text>
      </Screen>
    );
  }

  if (!profile) {
    return (
      <Screen>
        <Text>Profile not found.</Text>
      </Screen>
    );
  }

  if (profile.onboarding_completed) {
    return <Redirect href="/(tabs)/today" />;
  }

  return (
    <Screen>
      <OnboardingFlow
        onComplete={async ({
          currentWeightKg,
          goalWeightKg,
          heightCm,
          sex,
          birthDate,
          activityLevel,
        }) => {
          await saveWeight({
            weight_kg: currentWeightKg,
            entry_date: toDateKey(),
          });
          await complete({
            heightCm,
            goalWeightKg,
            sex,
            birthDate,
            activityLevel,
          });
          router.replace("/(tabs)/today");
        }}
      />
    </Screen>
  );
}
