import { StyleSheet, View } from "react-native";

import {
  Skeleton,
  SkeletonCard,
  SkeletonRowCard,
} from "@/components/ui/skeleton";
import { Spacing } from "@/constants/theme";

export function CaloriesScreenSkeleton() {
  return (
    <View style={styles.stack}>
      <SkeletonCard gap={Spacing.three}>
        <Skeleton width="40%" height={16} />
        <Skeleton width="55%" height={28} />
        <Skeleton height={10} radius="full" />
        <Skeleton width="45%" height={12} />
      </SkeletonCard>

      <SkeletonCard gap={Spacing.three}>
        <Skeleton width="36%" height={16} />
        <Skeleton height={10} radius="full" />
        <Skeleton height={10} radius="full" />
        <Skeleton height={10} radius="full" />
      </SkeletonCard>

      <SkeletonCard gap={Spacing.three}>
        <View style={styles.chartHeader}>
          <View style={styles.chartCopy}>
            <Skeleton width="48%" height={16} />
            <Skeleton width="62%" height={12} />
          </View>
          <Skeleton width={108} height={32} radius="md" />
        </View>
        <Skeleton height={180} radius="md" />
      </SkeletonCard>

      <SkeletonRowCard />

      <Skeleton width="22%" height={16} />
      <SkeletonRowCard />
      <SkeletonRowCard />
      <SkeletonRowCard />
    </View>
  );
}

export function CalorieDaySkeleton() {
  return (
    <View style={styles.stack}>
      <SkeletonCard gap={Spacing.three}>
        <Skeleton width="40%" height={16} />
        <Skeleton width="55%" height={28} />
        <Skeleton height={10} radius="full" />
        <Skeleton width="45%" height={12} />
      </SkeletonCard>

      <SkeletonCard gap={Spacing.three}>
        <Skeleton width="36%" height={16} />
        <Skeleton height={10} radius="full" />
        <Skeleton height={10} radius="full" />
        <Skeleton height={10} radius="full" />
      </SkeletonCard>

      <SkeletonRowCard />

      <Skeleton width="20%" height={16} />
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
