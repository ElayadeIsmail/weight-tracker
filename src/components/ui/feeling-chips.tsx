import { Pressable, StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";
import { FEELING_OPTIONS, type FeelingOption } from "@/constants/picker";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type FeelingChipsProps = Readonly<{
  value?: string;
  onChange: (value: FeelingOption | undefined) => void;
}>;

export function FeelingChips({ value, onChange }: FeelingChipsProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text type="label" themeColor="textSecondary">
        How do you feel?
      </Text>
      <View style={styles.row}>
        {FEELING_OPTIONS.map((option) => {
          const selected = value === option;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(selected ? undefined : option)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected
                    ? theme.primary
                    : theme.backgroundElement,
                  borderColor: selected ? theme.primary : theme.border,
                },
              ]}
            >
              <Text
                type="smallBold"
                style={selected ? styles.selectedText : undefined}
                themeColor={selected ? undefined : "textSecondary"}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  chip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  selectedText: {
    color: "#FFFFFF",
  },
});
