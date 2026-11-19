import type { PressableProps, StyleProp, ViewStyle } from "react-native";

export type ButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

export type ButtonSize = "default" | "sm" | "lg";

export type ButtonProps = Readonly<
  Omit<PressableProps, "children" | "style"> & {
    label: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
  }
>;
