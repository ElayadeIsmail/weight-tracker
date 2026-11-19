import { Pressable, StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type FieldTriggerProps = Readonly<{
  label: string;
  value: string;
  onPress: () => void;
}>;

export function FieldTrigger({ label, value, onPress }: FieldTriggerProps) {
  const theme = useTheme();

  return (
    <View style={styles.field}>
      <Text type="label" themeColor="textSecondary">
        {label}
      </Text>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text type="smallBold">{value}</Text>
        <Text type="small" themeColor="textSecondary">
          Change
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.one,
  },
  trigger: {
    minHeight: 52,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
});
