import { StyleSheet, View } from "react-native";

import { ONBOARDING_COPY } from "@/components/onboarding/config";
import { Button } from "@/components/ui/button";
import { HeightPicker } from "@/components/ui/height-picker";
import { ScreenHeader } from "@/components/ui/screen-header";
import { WeightPicker } from "@/components/ui/weight-picker";
import { Spacing } from "@/constants/theme";

type NumbersStepProps = Readonly<{
  currentWeight: number;
  height: number;
  onWeightChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onNext: () => void;
}>;

export function NumbersStep({
  currentWeight,
  height,
  onWeightChange,
  onHeightChange,
  onNext,
}: NumbersStepProps) {
  return (
    <View style={styles.section}>
      <ScreenHeader
        eyebrow={ONBOARDING_COPY.numbers.eyebrow}
        title={ONBOARDING_COPY.numbers.title}
        description={ONBOARDING_COPY.numbers.description}
      />
      <WeightPicker
        label="Current weight (kg)"
        value={currentWeight}
        onChange={onWeightChange}
      />
      <HeightPicker value={height} onChange={onHeightChange} />
      <Button label="Continue" onPress={onNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
});
