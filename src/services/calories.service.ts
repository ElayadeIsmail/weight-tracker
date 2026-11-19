import { env } from "@/lib/env";
import { supabase } from "@/lib/supabase";
import type { NutritionEstimate, PickedMealImage } from "@/types/meal";
import { arrayBufferToBase64 } from "@/utils/base64";

type EstimateResponse = {
  estimate?: NutritionEstimate;
  error?: string;
};

async function imageToBase64(image: PickedMealImage) {
  if (image.base64) return image.base64.replace(/\s/g, "");

  const response = await fetch(image.uri);
  if (!response.ok) {
    throw new Error("Failed to read meal photo");
  }
  return arrayBufferToBase64(await response.arrayBuffer());
}

export async function estimateMealCalories(
  image: PickedMealImage,
): Promise<NutritionEstimate> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("Not authenticated.");

  const mimeType = image.mimeType || "image/jpeg";
  const base64 = await imageToBase64(image);

  const response = await fetch(env.EXPO_PUBLIC_ESTIMATE_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: base64,
      mimeType,
    }),
  });

  const payload = (await response.json()) as EstimateResponse;

  if (!response.ok) {
    throw new Error(payload.error ?? "Failed to estimate nutrition");
  }

  if (!payload.estimate) {
    throw new Error("Nutrition estimate missing from response");
  }

  return payload.estimate;
}
