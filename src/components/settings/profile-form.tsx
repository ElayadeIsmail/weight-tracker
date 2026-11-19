import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import * as v from "valibot";

import { FormTextField } from "@/components/auth/form-text-field";
import {
  PROFILE_FORM_COPY,
  getProfileFormDefaults,
} from "@/components/settings/config";
import { profileUpdateSchema } from "@/components/settings/schema";
import { BirthDateField } from "@/components/ui/birth-date-field";
import { Button } from "@/components/ui/button";
import { fieldErrorsFromIssues } from "@/components/ui/form/field-errors";
import { FormMessage } from "@/components/ui/form/form-message";
import { HeightPicker } from "@/components/ui/height-picker";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SelectField } from "@/components/ui/select-field";
import { Text } from "@/components/ui/text";
import { WeightPicker } from "@/components/ui/weight-picker";
import {
  ACTIVITY_LEVEL_VALUES,
  SEX_OPTIONS,
  activityLevelLabel,
  parseCalorieTargetInput,
} from "@/constants/profile";
import { Spacing } from "@/constants/theme";
import type {
  Profile,
  ProfileActivityLevel,
  ProfileSex,
} from "@/types/profile";

type ProfileFormProps = Readonly<{
  profile: Profile;
  onSave: (input: {
    displayName: string;
    heightCm: number;
    goalWeightKg: number;
    sex: ProfileSex;
    birthDate: string;
    activityLevel: ProfileActivityLevel;
    calorieTargetKcal: number | null;
  }) => Promise<void>;
}>;

export function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: getProfileFormDefaults(profile),
    validators: {
      onSubmit: ({ value }) => {
        const result = v.safeParse(profileUpdateSchema, value);
        if (result.success) return undefined;
        return { fields: fieldErrorsFromIssues(result.issues) };
      },
    },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await onSave({
          displayName: value.displayName.trim(),
          heightCm: value.heightCm,
          goalWeightKg: value.goalWeightKg,
          sex: value.sex,
          birthDate: value.birthDate,
          activityLevel: value.activityLevel,
          calorieTargetKcal: parseCalorieTargetInput(value.calorieTargetInput),
        });
      } catch {
        setError(PROFILE_FORM_COPY.saveError);
      }
    },
  });

  return (
    <View style={styles.form}>
      <SectionHeader
        title={PROFILE_FORM_COPY.sectionTitle}
        description={PROFILE_FORM_COPY.sectionDescription}
      />

      <FormTextField
        form={form}
        name="displayName"
        label="Display name"
        placeholder="Your name"
        autoCapitalize="words"
      />

      <form.Field name="sex">
        {(field) => (
          <View style={styles.field}>
            <Text type="label" themeColor="textSecondary">
              Sex
            </Text>
            <SegmentedControl
              options={SEX_OPTIONS}
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
              equalWidth
            />
          </View>
        )}
      </form.Field>

      <form.Field name="birthDate">
        {(field) => (
          <BirthDateField
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </form.Field>

      <form.Field name="heightCm">
        {(field) => (
          <HeightPicker
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </form.Field>

      <form.Field name="goalWeightKg">
        {(field) => (
          <WeightPicker
            label="Goal weight (kg)"
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </form.Field>

      <form.Field name="activityLevel">
        {(field) => (
          <SelectField
            label="Activity level"
            value={field.state.value}
            options={ACTIVITY_LEVEL_VALUES}
            onChange={(value) => field.handleChange(value)}
            formatLabel={activityLevelLabel}
          />
        )}
      </form.Field>

      <FormTextField
        form={form}
        name="calorieTargetInput"
        label={PROFILE_FORM_COPY.calorieTargetLabel}
        placeholder={PROFILE_FORM_COPY.calorieTargetPlaceholder}
        keyboardType="number-pad"
      />

      {error ? <FormMessage>{error}</FormMessage> : null}

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button
            label={isSubmitting ? "Saving…" : "Save profile"}
            disabled={isSubmitting}
            onPress={() => {
              void form.handleSubmit();
            }}
          />
        )}
      </form.Subscribe>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
  field: {
    gap: Spacing.one,
  },
});
