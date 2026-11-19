import { StyleSheet, View } from "react-native";

import { ONBOARDING_COPY } from "@/components/onboarding/config";
import { BirthDateField } from "@/components/ui/birth-date-field";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SelectField } from "@/components/ui/select-field";
import { Text } from "@/components/ui/text";
import {
  ACTIVITY_LEVEL_VALUES,
  SEX_OPTIONS,
  activityLevelLabel,
} from "@/constants/profile";
import { Spacing } from "@/constants/theme";
import type { ProfileActivityLevel, ProfileSex } from "@/types/profile";

type AboutYouStepProps = Readonly<{
  sex: ProfileSex;
  birthDate: string;
  activityLevel: ProfileActivityLevel;
  onSexChange: (value: ProfileSex) => void;
  onBirthDateChange: (value: string) => void;
  onActivityLevelChange: (value: ProfileActivityLevel) => void;
  onNext: () => void;
  onBack: () => void;
}>;

export function AboutYouStep({
  sex,
  birthDate,
  activityLevel,
  onSexChange,
  onBirthDateChange,
  onActivityLevelChange,
  onNext,
  onBack,
}: AboutYouStepProps) {
  return (
    <View style={styles.section}>
      <ScreenHeader
        eyebrow={ONBOARDING_COPY.aboutYou.eyebrow}
        title={ONBOARDING_COPY.aboutYou.title}
        description={ONBOARDING_COPY.aboutYou.description}
      />

      <View style={styles.field}>
        <Text type="label" themeColor="textSecondary">
          Sex
        </Text>
        <SegmentedControl
          options={SEX_OPTIONS}
          value={sex}
          onChange={onSexChange}
          equalWidth
        />
      </View>

      <BirthDateField value={birthDate} onChange={onBirthDateChange} />

      <SelectField
        label="Activity level"
        value={activityLevel}
        options={ACTIVITY_LEVEL_VALUES}
        onChange={onActivityLevelChange}
        formatLabel={activityLevelLabel}
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
  field: {
    gap: Spacing.one,
  },
});
