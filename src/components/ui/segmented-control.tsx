import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Text } from "./text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type SegmentOption<T extends string | number> = Readonly<{
  value: T;
  label: string;
}>;

type SegmentedControlProps<T extends string | number> = Readonly<{
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  equalWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  equalWidth = false,
  style,
}: SegmentedControlProps<T>) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.track,
        { backgroundColor: theme.backgroundSelected },
        style,
      ]}
    >
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <Pressable
            key={String(option.value)}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              equalWidth && styles.equalWidth,
              selected && { backgroundColor: theme.primary },
            ]}
          >
            <Text
              type="smallBold"
              style={selected ? styles.selectedLabel : undefined}
              themeColor={selected ? undefined : "textSecondary"}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    borderRadius: Radius.md,
    padding: Spacing.half,
    gap: Spacing.half,
  },
  option: {
    alignItems: "center",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
  },
  equalWidth: {
    flex: 1,
    paddingVertical: Spacing.two,
  },
  selectedLabel: {
    color: "#FFFFFF",
  },
});
