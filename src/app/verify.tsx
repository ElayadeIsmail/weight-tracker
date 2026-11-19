import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form/form-message";
import { Screen, ScreenHeader, Text } from "@/components/ui";
import { Spacing } from "@/constants/theme";
import { resendConfirmationEmail } from "@/services/auth.service";

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      setError("Missing email address. Go back and sign up again.");
      return;
    }

    setError(null);
    setMessage(null);
    setResending(true);

    try {
      await resendConfirmationEmail(email);
      setMessage("Confirmation email sent. Check your inbox.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend email");
    } finally {
      setResending(false);
    }
  };

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Almost there"
        title="Verify your email"
        description={
          email
            ? `We sent a confirmation link to ${email}. Open it on this device to finish signing up.`
            : "We sent a confirmation link to your email. Open it on this device to finish signing up."
        }
      />

      <View style={styles.actions}>
        {error ? <FormMessage>{error}</FormMessage> : null}
        {message ? (
          <Text themeColor="primary" type="small">
            {message}
          </Text>
        ) : null}

        <Button
          label={resending ? "Sending…" : "Resend email"}
          loading={resending}
          disabled={resending || !email}
          onPress={() => {
            void handleResend();
          }}
        />

        <Button
          variant="secondary"
          label="Back to log in"
          onPress={() => router.replace("/login")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: Spacing.three,
  },
});
