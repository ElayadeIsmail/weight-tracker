import type { ReactNode } from "react";

import { Text } from "@/components/ui/text";
import type { ThemeColor } from "@/constants/theme";

type FormMessageProps = Readonly<{
  children: ReactNode;
  tone?: "error" | "success" | "muted";
}>;

const TONE_COLOR: Record<NonNullable<FormMessageProps["tone"]>, ThemeColor> = {
  error: "accent",
  success: "primary",
  muted: "textSecondary",
};

export function FormMessage({ children, tone = "error" }: FormMessageProps) {
  return (
    <Text type="small" themeColor={TONE_COLOR[tone]}>
      {children}
    </Text>
  );
}
