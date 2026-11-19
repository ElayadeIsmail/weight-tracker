import { StyleSheet, View } from "react-native";

import { ONBOARDING_COPY } from "@/components/onboarding/config";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { WeightPicker } from "@/components/ui/weight-picker";
import { Spacing } from "@/constants/theme";

type GoalStepProps = Readonly<{
  goalWeight: number;
  onGoalChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
}>;

export function GoalStep({
  goalWeight,
  onGoalChange,
  onNext,
  onBack,
}: GoalStepProps) {
  return (
    <View style={styles.section}>
      <ScreenHeader
        eyebrow={ONBOARDING_COPY.goal.eyebrow}
        title={ONBOARDING_COPY.goal.title}
        description={ONBOARDING_COPY.goal.description}
      />
      <WeightPicker
        label="Goal weight (kg)"
        value={goalWeight}
        onChange={onGoalChange}
      />
      <Button label="Continue" onPress={onNext} />
      <Button variant="secondary" label="Back" onPress={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
});
