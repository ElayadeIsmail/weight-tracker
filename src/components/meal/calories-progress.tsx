import { StyleSheet, View } from "react-native";

import { SurfaceCard } from "@/components/ui/surface-card";
import { Text } from "@/components/ui/text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { DailyCalorieTarget } from "@/utils/calories";
import {
  calorieTargetSourceLabel,
  getCalorieProgress,
} from "@/utils/calories";
import { formatKcal } from "@/utils/meal";

type CaloriesProgressProps = Readonly<{
  eatenKcal: number;
  target: DailyCalorieTarget | null;
}>;

export function CaloriesProgress({ eatenKcal, target }: CaloriesProgressProps) {
  const theme = useTheme();

  if (target == null) {
    return (
      <SurfaceCard>
        <Text type="subtitle">Calorie progress</Text>
        <Text type="small" themeColor="textSecondary">
          Set a daily target or log your weight in profile so we can estimate
          your need.
        </Text>
      </SurfaceCard>
    );
  }

  const { progress, percent, remainingKcal, over } = getCalorieProgress(
    eatenKcal,
    target.targetKcal,
  );
  const tone = over ? "danger" : "primary";
  const fillColor = over ? theme.danger : theme.primary;

  let statusLabel: string;
  if (eatenKcal <= 0) {
    statusLabel = "Log a meal to start today.";
  } else if (over) {
    statusLabel = `${formatKcal(Math.abs(remainingKcal))} over need`;
  } else if (remainingKcal === 0) {
    statusLabel = "Daily need met.";
  } else {
    statusLabel = `${formatKcal(remainingKcal)} left`;
  }

  return (
    <SurfaceCard>
      <View style={styles.header}>
        <Text type="subtitle">Calorie progress</Text>
        <Text type="smallBold" themeColor={tone}>
          {percent}%
        </Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text type="label" themeColor="textSecondary">
            Calories
          </Text>
          <Text type="subtitle" themeColor={tone}>
            {Math.round(eatenKcal)} kcal
          </Text>
        </View>
        <View style={styles.stat}>
          <Text type="label" themeColor="textSecondary">
            Needed
          </Text>
          <Text type="subtitle" themeColor="text">
            {target.targetKcal} kcal
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.track,
          {
            backgroundColor: theme.backgroundSelected,
            borderColor: theme.border,
          },
        ]}
      >
        {progress > 0 ? (
          <View
            style={[
              styles.fill,
              {
                width: `${progress * 100}%`,
                backgroundColor: fillColor,
              },
            ]}
          />
        ) : null}
      </View>

      <View style={styles.meta}>
        <Text type="small" themeColor={over ? "danger" : "textSecondary"}>
          {statusLabel}
        </Text>
        <Text type="small" themeColor="textSecondary">
          {calorieTargetSourceLabel(target)}
        </Text>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stats: {
    flexDirection: "row",
    gap: Spacing.four,
  },
  stat: {
    flex: 1,
    gap: Spacing.half,
  },
  track: {
    height: 10,
    borderRadius: Radius.full,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  fill: {
    height: "100%",
    borderRadius: Radius.full,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
});
