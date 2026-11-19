import { StyleSheet, Text as RNText, type TextProps } from "react-native";

import { Fonts, ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type ThemedTextProps = TextProps & {
  type?: keyof typeof styles;
  themeColor?: ThemeColor;
};

export function Text({
  style,
  type = "default",
  themeColor = "text",
  ...props
}: ThemedTextProps) {
  const theme = useTheme();

  return (
    <RNText
      style={[styles[type], { color: theme[themeColor] }, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: Fonts.sansMedium,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontFamily: Fonts.sansBold,
    fontSize: 34,
    lineHeight: 40,
  },
  headline: {
    fontFamily: Fonts.sansBold,
    fontSize: 28,
    lineHeight: 34,
  },
  small: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  smallBold: {
    fontFamily: Fonts.sansBold,
    fontSize: 14,
    lineHeight: 20,
  },
  subtitle: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  label: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  number: {
    fontFamily: Fonts.sansBold,
    fontSize: 48,
    lineHeight: 54,
    letterSpacing: -1,
  },
});
