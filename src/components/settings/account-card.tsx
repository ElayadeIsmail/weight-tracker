import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Text } from "@/components/ui/text";
import { signOut } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

type AccountCardProps = Readonly<{
  email?: string | null;
  displayName?: string | null;
  onEditProfile?: () => void;
}>;

export function AccountCard({
  email,
  displayName,
  onEditProfile,
}: AccountCardProps) {
  const clearSession = useAuthStore((s) => s.signout);
  const queryClient = useQueryClient();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    try {
      await signOut();
    } finally {
      queryClient.clear();
      clearSession();
      router.replace("/login");
    }
  }

  return (
    <SurfaceCard>
      <Text type="subtitle">Account</Text>
      <Text type="smallBold">{displayName || "Weight Tracker user"}</Text>
      <Text type="small" themeColor="textSecondary">
        {email ?? "No email"}
      </Text>
      {onEditProfile ? (
        <Button label="Edit profile" onPress={onEditProfile} />
      ) : null}
      <Button
        variant="secondary"
        label="Log out"
        loading={loggingOut}
        onPress={() => {
          void handleLogout();
        }}
      />
    </SurfaceCard>
  );
}
