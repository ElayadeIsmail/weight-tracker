import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { NudgeButton } from "@/components/ui/nudge-button";
import { PickerHeader } from "@/components/ui/picker-header";
import { SelectField } from "@/components/ui/select-field";
import { Spacing } from "@/constants/theme";
import {
  clampWeightKg,
  createDecimalOptions,
  createWholeWeightOptions,
  joinWeight,
  splitWeight,
} from "@/utils/picker";

type WeightPickerProps = Readonly<{
  label?: string;
  value: number;
  onChange: (value: number) => void;
}>;

export function WeightPicker({
  label = "Weight (kg)",
  value,
  onChange,
}: WeightPickerProps) {
  const { whole, decimal } = splitWeight(value);
  const wholeOptions = useMemo(() => createWholeWeightOptions(), []);
  const decimalOptions = useMemo(() => createDecimalOptions(), []);

  const nudge = (delta: number) => {
    onChange(clampWeightKg(value + delta));
  };

  return (
    <View style={styles.container}>
      <PickerHeader label={label} value={`${value.toFixed(1)} kg`} />

      <View style={styles.nudgeRow}>
        <NudgeButton label="-0.1" onPress={() => nudge(-0.1)} />
        <NudgeButton label="+0.1" onPress={() => nudge(0.1)} />
      </View>

      <View style={styles.pickers}>
        <View style={styles.pickerCol}>
          <SelectField
            label="Kilograms"
            value={whole}
            options={wholeOptions}
            onChange={(nextWhole) => onChange(joinWeight(nextWhole, decimal))}
            unit="kg"
          />
        </View>
        <View style={styles.pickerCol}>
          <SelectField
            label="Decimal"
            value={decimal}
            options={decimalOptions}
            onChange={(nextDecimal) => onChange(joinWeight(whole, nextDecimal))}
            formatLabel={(item) => `.${item}`}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  nudgeRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  pickers: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  pickerCol: {
    flex: 1,
  },
});
