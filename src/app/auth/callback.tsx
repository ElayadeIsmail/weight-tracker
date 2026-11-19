import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Screen, ScreenHeader, Text } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { Spacing } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth.store";

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams<{
    code?: string | string[];
    error?: string | string[];
    error_description?: string | string[];
  }>();

  const code = firstParam(params.code);
  const error = firstParam(params.error);
  const errorDescription = firstParam(params.error_description);

  const handledRef = useRef(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (handledRef.current) return;

    async function completeAuth() {
      handledRef.current = true;

      try {
        if (errorDescription) {
          throw new Error(errorDescription);
        }

        if (error) {
          throw new Error(error);
        }

        if (!code) {
          throw new Error("Missing authorization code.");
        }

        const { data, error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          throw exchangeError;
        }

        // Persist session before navigating so Index doesn't treat us as logged out.
        useAuthStore.getState().setSession(data.session);

        router.replace("/");
      } catch (err) {
        setAuthError(
          err instanceof Error
            ? err.message
            : "Could not complete authentication.",
        );
      }
    }

    void completeAuth();
  }, [code, error, errorDescription]);

  if (authError) {
    return (
      <Screen>
        <ScreenHeader
          eyebrow="Verification"
          title="Could not sign you in"
          description={authError}
          eyebrowColor="accent"
        />

        <View style={styles.actions}>
          <Button
            label="Back to log in"
            onPress={() => router.replace("/login")}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen contentStyle={styles.loadingContent}>
      <ScreenHeader
        eyebrow="Verification"
        title="Signing you in"
        description="Confirming your email and opening your account."
      />

      <LoadingState />

      <Text type="small" themeColor="textSecondary" style={styles.hint}>
        This only takes a moment…
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingContent: {
    gap: Spacing.four,
  },
  actions: {
    gap: Spacing.three,
  },
  hint: {
    textAlign: "center",
  },
});
