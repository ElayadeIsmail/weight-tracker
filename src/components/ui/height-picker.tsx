import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { PickerHeader } from "@/components/ui/picker-header";
import { SelectField } from "@/components/ui/select-field";
import { Spacing } from "@/constants/theme";
import { createHeightOptions } from "@/utils/picker";

type HeightPickerProps = Readonly<{
  label?: string;
  value: number;
  onChange: (value: number) => void;
}>;

export function HeightPicker({
  label = "Height (cm)",
  value,
  onChange,
}: HeightPickerProps) {
  const options = useMemo(() => createHeightOptions(), []);

  return (
    <View style={styles.container}>
      <PickerHeader label={label} value={`${value} cm`} />
      <SelectField
        label={label}
        value={value}
        options={options}
        onChange={onChange}
        formatLabel={(item) => `${item}`}
        unit="cm"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
});
