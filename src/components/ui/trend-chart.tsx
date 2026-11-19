import { useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Text } from "@/components/ui/text";
import { CHART_RANGES } from "@/constants/picker";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { ChartPoint } from "@/types/weight";
import { shiftDateKey, toDateKey } from "@/utils/date";

type TrendChartProps = Readonly<{
  points: ChartPoint[];
  title?: string;
  emptyDescription: string;
  unitLabel?: string;
}>;

export function TrendChart({
  points,
  title = "Trend",
  emptyDescription,
  unitLabel,
}: TrendChartProps) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const [rangeDays, setRangeDays] =
    useState<(typeof CHART_RANGES)[number]["days"]>(14);

  const visiblePoints = useMemo(() => {
    const start = shiftDateKey(toDateKey(), -(rangeDays - 1));
    return points.filter((point) => point.date >= start);
  }, [points, rangeDays]);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  if (points.length === 0) {
    return (
      <SurfaceCard>
        <SectionHeader title={title} description={emptyDescription} />
      </SurfaceCard>
    );
  }

  const values = visiblePoints.map((point) => point.value);
  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 1;
  const padding = Math.max((max - min) * 0.2, max === min ? Math.max(max * 0.1, 1) : 0.5);
  const yMin = Math.max(min - padding, 0);
  const yMax = max + padding;
  const rangeSummary =
    visiblePoints.length === 0
      ? `No logs in the last ${rangeDays} days`
      : `${visiblePoints.length} day${visiblePoints.length === 1 ? "" : "s"} · ${rangeDays}D${
          unitLabel ? ` · ${unitLabel}` : ""
        }`;

  return (
    <SurfaceCard onLayout={onLayout} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text type="subtitle">{title}</Text>
          <Text type="small" themeColor="textSecondary">
            {rangeSummary}
          </Text>
        </View>
        <SegmentedControl
          options={CHART_RANGES.map((range) => ({
            value: range.days,
            label: range.label,
          }))}
          value={rangeDays}
          onChange={setRangeDays}
        />
      </View>

      {width > 0 && visiblePoints.length > 0 ? (
        <LineChart
          data={visiblePoints}
          width={width - Spacing.three}
          height={180}
          color={theme.primary}
          thickness={3}
          startFillColor={theme.primary}
          endFillColor={theme.primary}
          startOpacity={0.25}
          endOpacity={0.02}
          areaChart
          hideDataPoints={visiblePoints.length > 10}
          dataPointsColor={theme.primary}
          dataPointsRadius={4}
          yAxisColor={theme.border}
          xAxisColor={theme.border}
          yAxisTextStyle={{ color: theme.textSecondary, fontSize: 11 }}
          xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
          rulesColor={theme.border}
          rulesType="solid"
          noOfSections={4}
          yAxisOffset={yMin}
          maxValue={Math.max(yMax - yMin, 1)}
          spacing={Math.max(
            (width - 72) / Math.max(visiblePoints.length - 1, 1),
            28,
          )}
          initialSpacing={12}
          endSpacing={12}
          isAnimated
        />
      ) : width > 0 ? (
        <Text type="small" themeColor="textSecondary" style={styles.emptyRange}>
          No data in this range. Try 14D or 30D, or log more days.
        </Text>
      ) : null}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  emptyRange: {
    marginTop: Spacing.two,
  },
});
