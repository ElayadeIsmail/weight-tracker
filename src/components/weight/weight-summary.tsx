import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { IconCircleButton } from "@/components/ui/icon-circle-button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { WeightStats } from "@/types/weight";
import { formatWeight, formatWeightChange } from "@/utils/weight";

type WeightSummaryProps = Readonly<{
  stats: WeightStats;
}>;

export function WeightSummary({ stats }: WeightSummaryProps) {
  const theme = useTheme();
  const change = stats.changeKg;
  const changeColor =
    change == null
      ? theme.textSecondary
      : change > 0
        ? theme.accent
        : theme.primary;

  return (
    <SurfaceCard muted style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text type="label" themeColor="textSecondary">
            Latest weight
          </Text>
          <Text
            type="number"
            themeColor={stats.latest ? "primary" : "textSecondary"}
          >
            {stats.latest ? formatWeight(stats.latest.weight_kg) : "—"}
          </Text>
          <Text type="smallBold" style={{ color: changeColor }}>
            {formatWeightChange(change)}
          </Text>
        </View>
        <IconCircleButton
          accessibilityLabel="Add weight entry"
          onPress={() => router.push("/today/add-weight")}
        />
      </View>

      <View style={styles.statsRow}>
        <Stat label="Avg" value={stats.averageKg} />
        <Stat label="Min" value={stats.minKg} />
        <Stat label="Max" value={stats.maxKg} />
        <Stat label="Days" value={stats.count} isCount />
      </View>
    </SurfaceCard>
  );
}

function Stat({
  label,
  value,
  isCount = false,
}: Readonly<{ label: string; value: number | null; isCount?: boolean }>) {
  return (
    <View style={styles.stat}>
      <Text type="small" themeColor="textSecondary">
        {label}
      </Text>
      <Text type="smallBold">
        {value == null ? "—" : isCount ? `${value}` : formatWeight(value)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  headerText: {
    flex: 1,
    gap: Spacing.half,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  stat: {
    flex: 1,
    gap: 2,
  },
});
