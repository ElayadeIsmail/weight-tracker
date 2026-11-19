import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable } from "react-native";

import {
  CaloriesChart,
  CaloriesProgress,
  CaloriesScreenSkeleton,
  MacrosProgress,
  MealDayHistoryList,
  MealDaySummaryCard,
} from "@/components/meal";
import { IconCircleButton, ScreenHeader } from "@/components/ui";
import { useDailyCalorieTarget } from "@/hooks/use-daily-calorie-target";
import { useMealHistory, useMealsForDate } from "@/hooks/use-meals";
import { toDateKey } from "@/utils/date";
import { toCaloriesChartPoints } from "@/utils/meal";
import { addMealHref, calorieDayHref } from "@/utils/meal-routes";

export default function CaloriesScreen() {
  const today = toDateKey();
  const { data: todaySummary, isPending: todayPending } = useMealsForDate(today);
  const {
    data: history,
    isPending: historyPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMealHistory();
  const { target, macros, isPending: targetPending } = useDailyCalorieTarget();

  const days = history ?? [];
  const pastDays = days.filter((day) => day.entryDate !== today);
  const chartPoints = useMemo(() => toCaloriesChartPoints(days), [days]);
  const isPending = todayPending || historyPending || targetPending;
  const eatenKcal = todaySummary?.totalCalories ?? 0;

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  return (
    <MealDayHistoryList
      days={pastDays}
      onPressDay={(date) => router.push(calorieDayHref(date))}
      onEndReached={handleEndReached}
      isLoadingMore={isFetchingNextPage}
      isPending={isPending}
      pendingFallback={<CaloriesScreenSkeleton />}
      header={
        <>
          <ScreenHeader
            eyebrow="Nutrition"
            title="Calories"
            description="Track meals against your daily need. Open a day for macros."
            eyebrowColor="accent"
            action={
              <IconCircleButton
                accessibilityLabel="Add meal"
                onPress={() => router.push(addMealHref(today))}
              />
            }
          />

          {!isPending ? (
            <>
              <CaloriesProgress eatenKcal={eatenKcal} target={target} />
              <MacrosProgress
                eaten={{
                  proteinG: todaySummary?.proteinG ?? 0,
                  carbohydratesG: todaySummary?.carbohydratesG ?? 0,
                  fatG: todaySummary?.fatG ?? 0,
                }}
                targets={macros}
              />

              <CaloriesChart points={chartPoints} />

              {todaySummary ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Open today's calorie day"
                  onPress={() => router.push(calorieDayHref(today))}
                  style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
                >
                  <MealDaySummaryCard summary={todaySummary} />
                </Pressable>
              ) : null}
            </>
          ) : null}
        </>
      }
    />
  );
}
