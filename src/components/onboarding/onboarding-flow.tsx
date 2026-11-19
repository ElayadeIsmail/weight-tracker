import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { ONBOARDING_COPY } from "@/components/onboarding/config";
import { AboutYouStep } from "@/components/onboarding/steps/about-you-step";
import { BmiStep } from "@/components/onboarding/steps/bmi-step";
import { GoalStep } from "@/components/onboarding/steps/goal-step";
import { NumbersStep } from "@/components/onboarding/steps/numbers-step";
import { WelcomeStep } from "@/components/onboarding/steps/welcome-step";
import {
  DEFAULT_ACTIVITY_LEVEL,
  DEFAULT_SEX,
} from "@/constants/profile";
import { DEFAULT_HEIGHT_CM, DEFAULT_WEIGHT_KG } from "@/constants/picker";
import type { ProfileActivityLevel, ProfileSex } from "@/types/profile";
import { resolveInitialBirthDate } from "@/utils/birth-date";
import { getBmiResult } from "@/utils/bmi";

type OnboardingFlowProps = Readonly<{
  onComplete: (input: {
    currentWeightKg: number;
    goalWeightKg: number;
    heightCm: number;
    sex: ProfileSex;
    birthDate: string;
    activityLevel: ProfileActivityLevel;
  }) => Promise<void>;
}>;

enum Step {
  Welcome,
  Numbers,
  AboutYou,
  Goal,
  Summary,
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(Step.Welcome);

  const [currentWeight, setCurrentWeight] = useState(DEFAULT_WEIGHT_KG);
  const [height, setHeight] = useState(DEFAULT_HEIGHT_CM);
  const [goalWeight, setGoalWeight] = useState(DEFAULT_WEIGHT_KG - 5);
  const [sex, setSex] = useState<ProfileSex>(DEFAULT_SEX);
  const [birthDate, setBirthDate] = useState(() =>
    resolveInitialBirthDate(null),
  );
  const [activityLevel, setActivityLevel] = useState<ProfileActivityLevel>(
    DEFAULT_ACTIVITY_LEVEL,
  );

  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const bmiResult = useMemo(
    () => getBmiResult(currentWeight, height),
    [currentWeight, height],
  );

  const handleNumbersNext = () => {
    setGoalWeight((goal) =>
      goal === DEFAULT_WEIGHT_KG - 5 ? Math.max(currentWeight - 5, 30) : goal,
    );
    setStep(Step.AboutYou);
  };

  const handleFinish = async () => {
    if (isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      await onComplete({
        currentWeightKg: currentWeight,
        goalWeightKg: goalWeight,
        heightCm: height,
        sex,
        birthDate,
        activityLevel,
      });
    } catch {
      setError(ONBOARDING_COPY.saveError);
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {(() => {
        switch (step) {
          case Step.Welcome:
            return <WelcomeStep onNext={() => setStep(Step.Numbers)} />;

          case Step.Numbers:
            return (
              <NumbersStep
                currentWeight={currentWeight}
                height={height}
                onWeightChange={setCurrentWeight}
                onHeightChange={setHeight}
                onNext={handleNumbersNext}
              />
            );

          case Step.AboutYou:
            return (
              <AboutYouStep
                sex={sex}
                birthDate={birthDate}
                activityLevel={activityLevel}
                onSexChange={setSex}
                onBirthDateChange={setBirthDate}
                onActivityLevelChange={setActivityLevel}
                onNext={() => setStep(Step.Goal)}
                onBack={() => setStep(Step.Numbers)}
              />
            );

          case Step.Goal:
            return (
              <GoalStep
                goalWeight={goalWeight}
                onGoalChange={setGoalWeight}
                onNext={() => setStep(Step.Summary)}
                onBack={() => setStep(Step.AboutYou)}
              />
            );

          case Step.Summary:
            return (
              <BmiStep
                currentWeight={currentWeight}
                height={height}
                goalWeight={goalWeight}
                bmiResult={bmiResult}
                error={error}
                isSaving={isSaving}
                onFinish={() => void handleFinish()}
                onBack={() => setStep(Step.Goal)}
              />
            );
        }
      })()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
