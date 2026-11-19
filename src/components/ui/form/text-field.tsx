import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";

import { FormMessage } from "@/components/ui/form/form-message";
import { Text } from "@/components/ui/text";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type TextFieldProps = Readonly<
  {
    label: string;
    error?: string;
  } & Pick<
    TextInputProps,
    | "value"
    | "onChangeText"
    | "placeholder"
    | "secureTextEntry"
    | "keyboardType"
    | "autoCapitalize"
    | "autoCorrect"
    | "onBlur"
  >
>;

export function TextField({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoCorrect = false,
  error,
}: TextFieldProps) {
  const theme = useTheme();

  return (
    <View style={styles.field}>
      <Text type="label" themeColor="textSecondary">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        style={[
          styles.input,
          {
            color: theme.text,
            backgroundColor: theme.backgroundElement,
            borderColor: error ? theme.accent : theme.border,
          },
        ]}
      />
      {error ? <FormMessage>{error}</FormMessage> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.one,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
    fontFamily: Fonts.sansMedium,
  },
});
