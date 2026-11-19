import { router } from "expo-router";

import { AccountCard } from "@/components/settings/account-card";
import { ThemeToggle } from "@/components/settings/theme-toggle";
import { Screen, ScreenHeader } from "@/components/ui";
import { useProfile } from "@/hooks/use-profile";

export default function SettingsScreen() {
  const { data } = useProfile();

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Preferences"
        title="Settings"
        description="Manage your account, appearance, and goals."
      />
      <AccountCard
        displayName={data?.display_name}
        email={data?.email ?? null}
        onEditProfile={() => router.push("/settings/edit-profile")}
      />
      <ThemeToggle />
    </Screen>
  );
}
