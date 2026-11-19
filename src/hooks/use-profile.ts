import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { profileRepository } from "@/repositories/profile.repository";
import { useAuthStore } from "@/store/auth.store";
import type { ProfileActivityLevel, ProfileSex } from "@/types/profile";

export function useProfile() {
  const session = useAuthStore((s) => s.session);

  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: profileRepository.get,
    enabled: !!session,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileRepository.update,

    onSuccess(profile) {
      queryClient.setQueryData(queryKeys.profile, profile);
    },
  });
}

type CompleteOnboardingInput = Readonly<{
  heightCm: number;
  goalWeightKg: number;
  sex: ProfileSex;
  birthDate: string;
  activityLevel: ProfileActivityLevel;
}>;

export function useCompleteOnboarding() {
  const mutation = useUpdateProfile();

  return {
    ...mutation,

    complete: ({
      heightCm,
      goalWeightKg,
      sex,
      birthDate,
      activityLevel,
    }: CompleteOnboardingInput) =>
      mutation.mutateAsync({
        height_cm: heightCm,
        goal_weight_kg: goalWeightKg,
        sex,
        birth_date: birthDate,
        activity_level: activityLevel,
        onboarding_completed: true,
      }),
  };
}
