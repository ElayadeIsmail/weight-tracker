import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";

type MealPhotoActionsProps = Readonly<{
  onTakePhoto: () => void;
  onUploadPhoto: () => void;
  onEnterManually?: () => void;
  disabled?: boolean;
}>;

export function MealPhotoActions({
  onTakePhoto,
  onUploadPhoto,
  onEnterManually,
  disabled = false,
}: MealPhotoActionsProps) {
  return (
    <View style={styles.root}>
      <View style={styles.actions}>
        <Button
          label="Take photo"
          onPress={onTakePhoto}
          disabled={disabled}
          style={styles.button}
        />
        <Button
          label="Upload photo"
          variant="secondary"
          onPress={onUploadPhoto}
          disabled={disabled}
          style={styles.button}
        />
      </View>
      {onEnterManually ? (
        <Button
          label="Enter manually"
          variant="secondary"
          onPress={onEnterManually}
          disabled={disabled}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.two,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  button: {
    flex: 1,
  },
});
