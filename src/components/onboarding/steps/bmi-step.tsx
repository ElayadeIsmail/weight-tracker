import { StyleSheet, View } from "react-native";

import { BmiScale } from "@/components/bmi/bmi-scale";
import { ONBOARDING_COPY } from "@/components/onboarding/config";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form/form-message";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import type { BmiResult } from "@/types/profile";

type BmiStepProps = Readonly<{
  currentWeight: number;
  height: number;
  goalWeight: number;
  bmiResult: BmiResult;
  error: string | null;
  isSaving: boolean;
  onFinish: () => void;
  onBack: () => void;
}>;

export function BmiStep({
  currentWeight,
  height,
  goalWeight,
  bmiResult,
  error,
  isSaving,
  onFinish,
  onBack,
}: BmiStepProps) {
  return (
    <View style={styles.section}>
      <ScreenHeader
        eyebrow={ONBOARDING_COPY.summary.eyebrow}
        title={ONBOARDING_COPY.summary.title}
        description={`Based on ${currentWeight.toFixed(1)} kg and ${height} cm.`}
      />
      <BmiScale result={bmiResult} />
      <Text type="small" themeColor="textSecondary">
        Goal: {goalWeight.toFixed(1)} kg
      </Text>
      {error ? <FormMessage>{error}</FormMessage> : null}
      <Button
        label={isSaving ? "Saving…" : "Start tracking"}
        disabled={isSaving}
        onPress={onFinish}
      />
      <Button variant="secondary" label="Back" onPress={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
});
