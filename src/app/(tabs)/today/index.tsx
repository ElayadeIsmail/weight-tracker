import { useMemo } from "react";

import { BmiScale } from "@/components/bmi/bmi-scale";
import { CaloriesSummary } from "@/components/meal";
import { Screen, ScreenHeader } from "@/components/ui";
import { GoalProgress } from "@/components/weight/goal-progress";
import { InsightCards } from "@/components/weight/insight-cards";
import { WeightSummary } from "@/components/weight/weight-summary";
import { useMealsForDate } from "@/hooks/use-meals";
import { useProfile } from "@/hooks/use-profile";
import { useWeightEntries } from "@/hooks/use-weight";
import { getBmiResult } from "@/utils/bmi";
import { toDateKey } from "@/utils/date";
import {
  getLoggingStreak,
  getWeeklyAverageKg,
  getWeeklyChangeKg,
} from "@/utils/insights";
import { sortEntriesByDateAsc, getWeightStats } from "@/utils/weight";

export default function TodayScreen() {
  const { data } = useWeightEntries();
  const { data: profile } = useProfile();
  const { data: mealSummary } = useMealsForDate();

  const { stats, streak, weeklyAverageKg, weeklyChangeKg, startKg } =
    useMemo(() => {
      const entries = data ?? [];
      const todayKey = toDateKey();
      const oldest = sortEntriesByDateAsc(entries)[0];

      return {
        stats: getWeightStats(data),
        streak: getLoggingStreak(entries, todayKey),
        weeklyAverageKg: getWeeklyAverageKg(entries, todayKey),
        weeklyChangeKg: getWeeklyChangeKg(entries, todayKey),
        startKg: oldest?.weight_kg ?? null,
      };
    }, [data]);

  const currentKg = stats.latest?.weight_kg ?? null;
  const bmiResult =
    currentKg != null && profile?.height_cm != null
      ? getBmiResult(currentKg, profile.height_cm)
      : null;

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Weight Tracker"
        title="Today"
        description="Log weight and meals. Your data syncs to your account."
      />

      <WeightSummary stats={stats} />
      <CaloriesSummary summary={mealSummary} />
      <InsightCards
        streak={streak}
        weeklyAverageKg={weeklyAverageKg}
        weeklyChangeKg={weeklyChangeKg}
      />
      {profile?.goal_weight_kg != null ? (
        <GoalProgress
          currentKg={currentKg}
          startKg={startKg}
          goalKg={profile.goal_weight_kg}
        />
      ) : null}
      {bmiResult ? <BmiScale result={bmiResult} compact /> : null}
    </Screen>
  );
}
