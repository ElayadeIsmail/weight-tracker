import { StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import { formatGrams } from "@/utils/meal";

type MacrosRowProps = Readonly<{
  proteinG: number;
  carbohydratesG: number;
  fatG: number;
  fiberG?: number;
  showFiber?: boolean;
}>;

export function MacrosRow({
  proteinG,
  carbohydratesG,
  fatG,
  fiberG = 0,
  showFiber = false,
}: MacrosRowProps) {
  return (
    <View style={styles.row}>
      <Macro label="Protein" value={formatGrams(proteinG)} />
      <Macro label="Carbs" value={formatGrams(carbohydratesG)} />
      <Macro label="Fat" value={formatGrams(fatG)} />
      {showFiber ? <Macro label="Fiber" value={formatGrams(fiberG)} /> : null}
    </View>
  );
}

function Macro({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <View style={styles.macro}>
      <Text type="small" themeColor="textSecondary">
        {label}
      </Text>
      <Text type="smallBold">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  macro: {
    flex: 1,
    gap: 2,
  },
});
