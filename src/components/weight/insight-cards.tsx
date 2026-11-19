import { StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatWeight, formatWeightChange } from "@/utils/weight";

type InsightCardsProps = Readonly<{
  streak: number;
  weeklyAverageKg: number | null;
  weeklyChangeKg: number | null;
}>;

export function InsightCards({
  streak,
  weeklyAverageKg,
  weeklyChangeKg,
}: InsightCardsProps) {
  const theme = useTheme();
  const changeColor =
    weeklyChangeKg == null
      ? theme.textSecondary
      : weeklyChangeKg > 0
        ? theme.accent
        : theme.primary;

  return (
    <View style={styles.row}>
      <SurfaceCard style={styles.card}>
        <Text type="label" themeColor="textSecondary">
          Streak
        </Text>
        <Text type="headline" themeColor="primary">
          {streak}
        </Text>
        <Text type="small" themeColor="textSecondary">
          {streak === 1 ? "day logged" : "days logged"}
        </Text>
      </SurfaceCard>

      <SurfaceCard style={styles.card}>
        <Text type="label" themeColor="textSecondary">
          7-day avg
        </Text>
        <Text type="headline">
          {weeklyAverageKg == null ? "—" : formatWeight(weeklyAverageKg)}
        </Text>
        <Text type="small" style={{ color: changeColor }}>
          {weeklyChangeKg == null
            ? "Need more logs"
            : `${formatWeightChange(weeklyChangeKg)} / wk`}
        </Text>
      </SurfaceCard>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  card: {
    flex: 1,
    gap: Spacing.one,
  },
});
