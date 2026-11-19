import { StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { getGoalProgress } from "@/utils/goal-progress";
import { formatWeight } from "@/utils/weight";

type GoalProgressProps = Readonly<{
  currentKg: number | null;
  startKg: number | null;
  goalKg: number;
}>;

export function GoalProgress({
  currentKg,
  startKg,
  goalKg,
}: GoalProgressProps) {
  const theme = useTheme();

  if (currentKg == null || startKg == null) {
    return (
      <SurfaceCard>
        <Text type="subtitle">Weight goal</Text>
        <Text type="small" themeColor="textSecondary">
          Target {formatWeight(goalKg)}. Log today to start tracking progress.
        </Text>
      </SurfaceCard>
    );
  }

  const { progress, percent, remainingKg, reached, direction } = getGoalProgress(
    startKg,
    currentKg,
    goalKg,
  );

  let statusLabel = "Stay at your goal weight.";
  if (reached) {
    statusLabel = "You reached your goal weight.";
  } else if (direction === "lose") {
    statusLabel = `${remainingKg.toFixed(1)} kg to lose`;
  } else if (direction === "gain") {
    statusLabel = `${Math.abs(remainingKg).toFixed(1)} kg to gain`;
  }

  return (
    <SurfaceCard>
      <View style={styles.header}>
        <Text type="subtitle">Weight goal</Text>
        <Text type="smallBold" themeColor="primary">
          {percent}%
        </Text>
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
                backgroundColor: theme.primary,
              },
            ]}
          />
        ) : null}
      </View>

      <View style={styles.meta}>
        <Text type="small" themeColor="textSecondary">
          {statusLabel}
        </Text>
        <Text type="small" themeColor="textSecondary">
          Target {formatWeight(goalKg)}
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
