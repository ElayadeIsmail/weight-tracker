import { StyleSheet, type ViewStyle } from "react-native";

import { Colors, type ThemeColor } from "@/constants/theme";

import type { ButtonVariant } from "./types";

type Theme = (typeof Colors)[keyof typeof Colors];

export type VariantStyle = {
  container: ViewStyle;
  labelColor: ThemeColor | "#FFFFFF";
};

export function getVariantStyles(
  variant: ButtonVariant,
  theme: Theme,
): VariantStyle {
  switch (variant) {
    case "secondary":
      return {
        container: {
          backgroundColor: theme.backgroundElement,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.border,
        },
        labelColor: "text",
      };
    case "outline":
      return {
        container: {
          backgroundColor: "transparent",
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.border,
        },
        labelColor: "text",
      };
    case "ghost":
      return {
        container: { backgroundColor: "transparent" },
        labelColor: "text",
      };
    case "destructive":
      return {
        container: { backgroundColor: theme.accent },
        labelColor: "#FFFFFF",
      };
    case "default":
    default:
      return {
        container: { backgroundColor: theme.primary },
        labelColor: "#FFFFFF",
      };
  }
}
