import { StyleSheet } from "react-native";

import { Radius, Spacing } from "@/constants/theme";

export const sizeStyles = StyleSheet.create({
  default: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  sm: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  lg: {
    paddingVertical: Spacing.three + Spacing.one,
    paddingHorizontal: Spacing.five,
  },
});

export const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
});