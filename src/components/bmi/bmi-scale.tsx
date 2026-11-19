import { StyleSheet, View } from "react-native";

import { BmiScaleBar } from "@/components/bmi/bmi-scale-bar";
import { Text } from "@/components/ui/text";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Spacing } from "@/constants/theme";
import type { BmiResult } from "@/types/profile";

type BmiScaleProps = Readonly<{
  result: BmiResult;
  compact?: boolean;
}>;

export function BmiScale({ result, compact = false }: BmiScaleProps) {
  return (
    <SurfaceCard style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text type="label" themeColor="textSecondary">
            BMI
          </Text>
          <Text type="headline">{result.value.toFixed(1)}</Text>
        </View>
        <View style={styles.badgeWrap}>
          <Text type="smallBold" themeColor="primary">
            {result.label}
          </Text>
          {!compact ? (
            <Text type="small" themeColor="textSecondary">
              {result.description}
            </Text>
          ) : null}
        </View>
      </View>

      <BmiScaleBar value={result.value} />
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  badgeWrap: {
    flex: 1,
    alignItems: "flex-end",
    gap: 2,
  },
});
