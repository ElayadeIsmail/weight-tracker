import { StyleSheet, View } from "react-native";

import { SurfaceCard } from "@/components/ui/surface-card";
import { Text } from "@/components/ui/text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { MacroProgressItem, MacroTargets } from "@/utils/macros";
import { getMacroProgressItems } from "@/utils/macros";
import { formatGrams } from "@/utils/meal";

type MacrosProgressProps = Readonly<{
  eaten: {
    proteinG: number;
    carbohydratesG: number;
    fatG: number;
  };
  targets: MacroTargets | null;
}>;

export function MacrosProgress({ eaten, targets }: MacrosProgressProps) {
  if (targets == null) {
    return (
      <SurfaceCard>
        <Text type="subtitle">Macro progress</Text>
        <Text type="small" themeColor="textSecondary">
          Macro targets appear once your daily calorie need is set.
        </Text>
      </SurfaceCard>
    );
  }

  const items = getMacroProgressItems(eaten, targets);

  return (
    <SurfaceCard>
      <Text type="subtitle">Macro progress</Text>
      <View style={styles.list}>
        {items.map((item) => (
          <MacroBar key={item.key} item={item} />
        ))}
      </View>
    </SurfaceCard>
  );
}

function MacroBar({ item }: Readonly<{ item: MacroProgressItem }>) {
  const theme = useTheme();
  const tone = item.over ? "danger" : "primary";
  const fillColor = item.over ? theme.danger : theme.primary;

  return (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Text type="smallBold">{item.label}</Text>
        <Text type="small" themeColor={tone}>
          {formatGrams(item.eatenG)} / {formatGrams(item.targetG)}
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
        {item.progress > 0 ? (
          <View
            style={[
              styles.fill,
              {
                width: `${item.progress * 100}%`,
                backgroundColor: fillColor,
              },
            ]}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.three,
  },
  item: {
    gap: Spacing.one,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.two,
  },
  track: {
    height: 8,
    borderRadius: Radius.full,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  fill: {
    height: "100%",
    borderRadius: Radius.full,
  },
});
