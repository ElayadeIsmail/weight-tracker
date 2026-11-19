import type { ReactNode } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components/ui/text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type BottomSheetProps = Readonly<{
  visible: boolean;
  title: string;
  onClose: () => void;
  onShow?: () => void;
  children: ReactNode;
  sheetStyle?: StyleProp<ViewStyle>;
}>;

export function BottomSheet({
  visible,
  title,
  onClose,
  onShow,
  children,
  sheetStyle,
}: BottomSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onShow={onShow}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTap} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.background,
              borderColor: theme.border,
              paddingBottom: Math.max(insets.bottom, Spacing.three),
            },
            sheetStyle,
          ]}
        >
          <View style={styles.header}>
            <Text type="subtitle">{title}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text type="smallBold" themeColor="primary">
                Done
              </Text>
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  backdropTap: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.three,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
