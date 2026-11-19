import { StyleSheet, View } from "react-native";

import { ONBOARDING_COPY } from "@/components/onboarding/config";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Spacing } from "@/constants/theme";

type WelcomeStepProps = Readonly<{
  onNext: () => void;
}>;

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <View style={styles.section}>
      <ScreenHeader
        eyebrow={ONBOARDING_COPY.welcome.eyebrow}
        title={ONBOARDING_COPY.welcome.title}
        description={ONBOARDING_COPY.welcome.description}
      />
      <Button label={ONBOARDING_COPY.welcome.cta} onPress={onNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
});
