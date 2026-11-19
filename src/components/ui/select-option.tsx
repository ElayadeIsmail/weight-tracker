import { Pressable, StyleSheet } from "react-native";

import { Text } from "@/components/ui/text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export const SELECT_OPTION_HEIGHT = 52;

type SelectOptionProps = Readonly<{
  label: string;
  selected: boolean;
  onPress: () => void;
}>;

export function SelectOption({ label, selected, onPress }: SelectOptionProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.option,
        {
          backgroundColor: selected ? theme.primaryMuted : "transparent",
          borderColor: selected ? theme.primary : theme.border,
        },
      ]}
    >
      <Text type="smallBold" themeColor={selected ? "primary" : "text"}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    height: SELECT_OPTION_HEIGHT - Spacing.one,
    marginBottom: Spacing.one,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    justifyContent: "center",
  },
});
