import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { MealImagePreview } from "@/components/meal/meal-image-preview";
import { MealNutritionForm } from "@/components/meal/meal-nutrition-form";
import { MealPhotoActions } from "@/components/meal/meal-photo-actions";
import {
  emptyMealNutritionFormValues,
  mealToNutritionFormValues,
  type MealNutritionFormValues,
  type MealNutritionSubmitValues,
} from "@/components/meal/schema";
import { DateField } from "@/components/ui/date-field";
import { InlineTextButton } from "@/components/ui/inline-text-button";
import { Spacing } from "@/constants/theme";
import {
  useEstimateMealCalories,
  useSaveMeal,
} from "@/hooks/use-meals";
import { supabase } from "@/lib/supabase";
import { uploadMealPhoto } from "@/services/meal-photo.service";
import type { PickedMealImage } from "@/types/meal";

type AddMealFormProps = Readonly<{
  entryDate: string;
  onDateChange?: (date: string) => void;
  onSaved?: () => void;
}>;

function normalizeMimeType(mimeType?: string | null) {
  if (!mimeType) return "image/jpeg";
  const normalized = mimeType.toLowerCase().split(";")[0]?.trim() ?? "";
  return normalized === "image/jpg" ? "image/jpeg" : normalized;
}

export function AddMealForm({
  entryDate,
  onDateChange,
  onSaved,
}: AddMealFormProps) {
  const [image, setImage] = useState<PickedMealImage | null>(null);
  const [formValues, setFormValues] = useState<MealNutritionFormValues | null>(
    null,
  );
  const [confidence, setConfidence] = useState<number | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: estimateCalories, isPending: isEstimating } =
    useEstimateMealCalories();
  const { mutateAsync: saveMeal, isPending: isSaving } = useSaveMeal();

  const resetEstimate = () => {
    setFormValues(null);
    setConfidence(null);
    setError(null);
  };

  const analyzeImage = async (picked: PickedMealImage) => {
    setImage(picked);
    setManualMode(false);
    resetEstimate();

    try {
      const result = await estimateCalories(picked);
      if (!result.is_food) {
        setError("No food detected in that photo. Try another angle or meal.");
        return;
      }
      setFormValues(mealToNutritionFormValues(result));
      setConfidence(result.confidence);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to estimate calories";
      setError(message);
    }
  };

  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Photos permission needed",
        "Allow photo library access to upload a meal photo.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsEditing: false,
      base64: true,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    await analyzeImage({
      uri: asset.uri,
      mimeType: normalizeMimeType(asset.mimeType),
      fileName: asset.fileName ?? undefined,
      base64: asset.base64 ?? undefined,
    });
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Camera permission needed",
        "Allow camera access to photograph your meal.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsEditing: false,
      base64: true,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    await analyzeImage({
      uri: asset.uri,
      mimeType: normalizeMimeType(asset.mimeType),
      fileName: asset.fileName ?? undefined,
      base64: asset.base64 ?? undefined,
    });
  };

  const enterManually = () => {
    setImage(null);
    setManualMode(true);
    setConfidence(null);
    setError(null);
    setFormValues(emptyMealNutritionFormValues());
  };

  const clearManual = () => {
    setManualMode(false);
    resetEstimate();
  };

  const handleSave = async (values: MealNutritionSubmitValues) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated.");

    let imageUrl: string | null = null;
    if (image) {
      imageUrl = await uploadMealPhoto(user.id, entryDate, image);
    }

    const clampedConfidence =
      confidence == null
        ? null
        : Math.min(1, Math.max(0, Math.round(confidence * 100) / 100));

    await saveMeal({
      entry_date: entryDate,
      dish_name: values.dish_name,
      serving: values.serving,
      items: values.items,
      calories_kcal: values.calories_kcal,
      protein_g: values.protein_g,
      carbohydrates_g: values.carbohydrates_g,
      fat_g: values.fat_g,
      fiber_g: values.fiber_g,
      confidence: clampedConfidence,
      image_url: imageUrl,
    });
    onSaved?.();
  };

  const busy = isEstimating || isSaving;

  return (
    <View style={styles.form}>
      {onDateChange ? (
        <DateField value={entryDate} onChange={onDateChange} />
      ) : null}

      {!manualMode ? (
        <MealPhotoActions
          onTakePhoto={takePhoto}
          onUploadPhoto={pickFromLibrary}
          onEnterManually={enterManually}
          disabled={busy}
        />
      ) : (
        <InlineTextButton
          label="Use photo instead"
          tone="primary"
          onPress={clearManual}
        />
      )}

      {!manualMode ? (
        <MealImagePreview
          uri={image?.uri}
          isEstimating={isEstimating}
          error={error}
        />
      ) : null}

      {formValues ? (
        <MealNutritionForm
          key={manualMode ? "manual" : (image?.uri ?? "estimate")}
          defaultValues={formValues}
          title={manualMode ? "Manual entry" : "Edit estimate"}
          submitLabel="Save meal"
          loading={isSaving}
          disabled={busy}
          footer={
            confidence != null
              ? `AI confidence ${Math.round(confidence * 100)}% — adjust anything before saving.`
              : "Enter calories and macros for this meal."
          }
          onSubmit={handleSave}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.five,
  },
});
