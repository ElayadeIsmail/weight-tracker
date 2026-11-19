import { StyleSheet, View } from "react-native";

import {
  Skeleton,
  SkeletonCard,
  SkeletonRowCard,
} from "@/components/ui/skeleton";
import { Spacing } from "@/constants/theme";

export function WeightHistorySkeleton() {
  return (
    <View style={styles.stack}>
      <SkeletonCard gap={Spacing.three}>
        <View style={styles.chartHeader}>
          <View style={styles.chartCopy}>
            <Skeleton width="36%" height={16} />
            <Skeleton width="58%" height={12} />
          </View>
          <Skeleton width={108} height={32} radius="md" />
        </View>
        <Skeleton height={180} radius="md" />
      </SkeletonCard>

      <Skeleton width="22%" height={16} />
      <SkeletonRowCard />
      <SkeletonRowCard />
      <SkeletonRowCard />
      <SkeletonRowCard />
      <SkeletonRowCard />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.five,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  chartCopy: {
    flex: 1,
    gap: Spacing.one,
  },
});
