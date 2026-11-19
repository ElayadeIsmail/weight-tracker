import { StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";

type PickerHeaderProps = Readonly<{
  label: string;
  value: string;
}>;

export function PickerHeader({ label, value }: PickerHeaderProps) {
  return (
    <View style={styles.header}>
      <Text type="label" themeColor="textSecondary">
        {label}
      </Text>
      <Text type="subtitle" themeColor="primary">
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
