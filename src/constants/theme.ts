import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#14201A",
    textSecondary: "#5E6B63",
    background: "#F4F7F5",
    backgroundElement: "#E8EEEA",
    backgroundSelected: "#DCE5DF",
    primary: "#1F8A5B",
    primaryMuted: "#D6EFE3",
    accent: "#E5673F",
    accentMuted: "#FCE4DB",
    border: "#D0DAD4",
    ring: "#B8E0CC",
    warning: "#C99214",
    /** IBM Carbon-style danger for exceeded calorie targets */
    danger: "#DA1E28",
  },
  dark: {
    text: "#F0F5F2",
    textSecondary: "#9AABA2",
    background: "#0E1411",
    backgroundElement: "#1A2320",
    backgroundSelected: "#25302B",
    primary: "#3DBF7F",
    primaryMuted: "#1A3328",
    accent: "#F08A66",
    accentMuted: "#3A241C",
    border: "#2A3530",
    ring: "#244C38",
    warning: "#E6B84D",
    /** IBM Carbon-style danger for exceeded calorie targets */
    danger: "#FF8389",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  sans: "DMSans_400Regular",
  sansMedium: "DMSans_500Medium",
  sansSemiBold: "DMSans_600SemiBold",
  sansBold: "DMSans_700Bold",
  mono: Platform.select({
    ios: "Menlo",
    android: "monospace",
    default: "monospace",
  })!,
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 10,
  md: 16,
  lg: 24,
  full: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
