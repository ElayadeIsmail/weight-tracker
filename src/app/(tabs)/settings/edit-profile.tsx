import { router } from "expo-router";

import { QueryBoundary } from "@/components/query-boundary";
import { ProfileForm } from "@/components/settings/profile-form";
import { Screen, ScreenHeader } from "@/components/ui";
import { InlineTextButton } from "@/components/ui/inline-text-button";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";

export default function EditProfileScreen() {
  const profileQuery = useProfile();
  const { mutateAsync: updateProfile } = useUpdateProfile();

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Account"
        title="Edit profile"
        description="Update your details for calorie estimates and goals."
        action={
          <InlineTextButton
            label="Back"
            tone="primary"
            onPress={() => router.back()}
          />
        }
      />

      <QueryBoundary query={profileQuery}>
        {(profile) => (
          <ProfileForm
            profile={profile}
            onSave={async ({
              displayName,
              heightCm,
              goalWeightKg,
              sex,
              birthDate,
              activityLevel,
              calorieTargetKcal,
            }) => {
              await updateProfile({
                display_name: displayName,
                height_cm: heightCm,
                goal_weight_kg: goalWeightKg,
                sex,
                birth_date: birthDate,
                activity_level: activityLevel,
                calorie_target_kcal: calorieTargetKcal,
              });
              router.back();
            }}
          />
        )}
      </QueryBoundary>
    </Screen>
  );
}
