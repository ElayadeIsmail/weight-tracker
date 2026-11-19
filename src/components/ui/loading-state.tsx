import {
  ActivityIndicator,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";

type LoadingStateProps = Readonly<{
  style?: StyleProp<ViewStyle>;
  flex?: boolean;
}>;

export function LoadingState({ style, flex = false }: LoadingStateProps) {
  const theme = useTheme();

  return (
    <View style={[flex ? styles.flex : styles.centered, style]}>
      <ActivityIndicator color={theme.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    minHeight: 240,
    alignItems: "center",
    justifyContent: "center",
  },
  flex: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
